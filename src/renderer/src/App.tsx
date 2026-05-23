import { useCallback, useEffect, useState, useRef, startTransition } from "react";
import PetScene from "./components/PetScene";
import ChatDialog from "./components/ChatDialog";
import Settings from "./components/Settings";
import { useEmotion } from "./hooks/useEmotion";
import { useChat } from "./hooks/useChat";
import { loadTodos } from "./services/todoStorage";
import { loadSelectedCharacter, saveSelectedCharacter } from "./configs/characters";

function App() {
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const showChatRef = useRef(false);
  const showSettingsRef = useRef(false);
  const [reminder, setReminder] = useState<string | null>(null);
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const windowStartPos = useRef({ x: 0, y: 0 });
  const currentWindowPos = useRef({ x: 0, y: 0 });
  const currentContentSize = useRef({ w: 400, h: 400 });
  const hasMoved = useRef(false);
  const [screenBounds, setScreenBounds] = useState({
    width: 1920,
    height: 1080,
  });
  const [windowSize, setWindowSize] = useState(400);
  const [, forceRender] = useState(0);
  const [todoVersion, setTodoVersion] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState(loadSelectedCharacter);

  const { emotion, setEmotion } = useEmotion(10000);
  const {
    messages, sendMessage, settings, setSettings, isConfigured,
    conversations, currentConversationId,
    onNewConversation, onSwitchConversation, onDeleteConversation
  } = useChat(setEmotion, () => setTodoVersion((v) => v + 1));

  // Idle reminder: check unfinished todos every 90s when idle
  useEffect(() => {
    if (emotion !== 'idle') {
      setReminder(null)
      return
    }

    const checkTodos = () => {
      const todos = loadTodos()
      const unfinished = todos.filter(t => !t.done)
      if (unfinished.length > 0) {
        const pick = unfinished[Math.floor(Math.random() * unfinished.length)]
        setReminder(`别忘了：${pick.text}`)
        setTimeout(() => setReminder(null), 8000)
      }
    }

    const timer = setTimeout(checkTodos, 90000)
    const interval = setInterval(checkTodos, 120000)
    return () => { clearTimeout(timer); clearInterval(interval) }
  }, [emotion]);

  useEffect(() => {
    if (!window.electronAPI) {
      console.warn("[App] electronAPI not available");
      return;
    }
    window.electronAPI.getScreenBounds().then(setScreenBounds);
    window.electronAPI.getWindowSize().then(setWindowSize);
    window.electronAPI
      .getWindowPosition()
      .then((pos: { x: number; y: number; w: number; h: number }) => {
        currentWindowPos.current = { x: pos.x, y: pos.y };
        currentContentSize.current = { w: pos.w, h: pos.h };
      });

    // Update content size on window resize (smooth with rAF)
    let rafId: number;
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        currentContentSize.current = {
          w: window.innerWidth,
          h: window.innerHeight,
        };
        forceRender((n) => n + 1);
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handlePetClick = useCallback(() => {
    if (showChatRef.current || showSettingsRef.current) {
      setShowChat(false);
      setShowSettings(false);
      showChatRef.current = false;
      showSettingsRef.current = false;
    } else {
      setShowChat(true);
      showChatRef.current = true;
    }
  }, []);

  const handleCloseChat = useCallback(() => {
    setShowChat(false);
    showChatRef.current = false;
  }, []);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!isConfigured) {
        setShowSettings(true);
        showSettingsRef.current = true;
        return "Please configure your API key first.";
      }
      return sendMessage(text);
    },
    [isConfigured, sendMessage],
  );

  const handleCloseSettings = useCallback(() => {
    setShowSettings(false);
    showSettingsRef.current = false;
  }, []);

  const handleCharacterChange = useCallback((name: string) => {
    saveSelectedCharacter(name);
    // Defer character switch to next tick so Settings closes first
    setTimeout(() => setSelectedCharacter(name), 0);
  }, []);

  // Click-through: transparent areas pass through to desktop
  useEffect(() => {
    window.electronAPI?.setIgnoreMouseEvents(true, { forward: true });
  }, []);

  const handlePointerOver = useCallback(() => {
    window.electronAPI?.setIgnoreMouseEvents(false);
  }, []);

  const handlePointerOut = useCallback(() => {
    if (!isDragging.current && !showChatRef.current && !showSettingsRef.current) {
      window.electronAPI?.setIgnoreMouseEvents(true, { forward: true });
    }
  }, []);

  // Sticky position: element follows window, but clamps to screen edges
  const getStickyLeft = useCallback(
    (winX: number, defaultLeft: number, elementWidth: number) => {
      const minLeft = -winX;
      const maxLeft = screenBounds.width - elementWidth - winX;
      return Math.max(minLeft, Math.min(defaultLeft, maxLeft));
    },
    [screenBounds],
  );

  const getStickyTop = useCallback(
    (winY: number, defaultTop: number, elementHeight: number) => {
      const minTop = -winY;
      const maxTop = screenBounds.height - elementHeight - winY;
      return Math.max(minTop, Math.min(defaultTop, maxTop));
    },
    [screenBounds],
  );

  // Drag: mousemove and mouseup on window — registered once, uses refs for state
  useEffect(() => {
    let rafId = 0;
    let pendingPos: { x: number; y: number } | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const dx = e.screenX - dragStartPos.current.x;
      const dy = e.screenY - dragStartPos.current.y;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMoved.current = true;
      }

      if (hasMoved.current) {
        pendingPos = {
          x: windowStartPos.current.x + dx,
          y: windowStartPos.current.y + dy,
        };
        if (!rafId) {
          rafId = requestAnimationFrame(() => {
            rafId = 0;
            if (!pendingPos || !isDragging.current) return;
            const pos = pendingPos;
            pendingPos = null;
            window.electronAPI
              .setWindowPosition(pos.x, pos.y)
              .then((actual: { x: number; y: number; w: number; h: number }) => {
                currentWindowPos.current = { x: actual.x, y: actual.y };
                currentContentSize.current = { w: actual.w, h: actual.h };
                forceRender((n) => n + 1);
              });
          });
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        cancelAnimationFrame(rafId);
        rafId = 0;
        pendingPos = null;
        // Ensure window receives events after drag ends
        window.electronAPI?.setIgnoreMouseEvents(false);
        if (!hasMoved.current) {
          handlePetClick();
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(rafId);
    };
  }, []); // No deps — uses refs and stable callbacks

  // R3F pointer down on mesh — start drag or disable click-through for right-click
  const handlePointerDown = useCallback((e: any) => {
    const nativeEvent = e.event || e;
    if (e.button === 0) {
      isDragging.current = true;
      hasMoved.current = false;
      dragStartPos.current = { x: nativeEvent.screenX, y: nativeEvent.screenY };
      windowStartPos.current = { ...currentWindowPos.current };
    } else if (e.button === 2) {
      // Ensure click-through is disabled so contextmenu event reaches the renderer
      window.electronAPI?.setIgnoreMouseEvents(false);
    }
  }, []);

  // Right-click — open settings
  const handleContextMenu = useCallback(() => {
    setShowSettings(true);
    showSettingsRef.current = true;
    setShowChat(false);
    showChatRef.current = false;
  }, []);

  const winX = currentWindowPos.current.x;
  const winY = currentWindowPos.current.y;
  const contentW = currentContentSize.current.w;

  // Ball: 15%-85%, Dialog: 10%-90% (wider than ball)
  const DIALOG_WIDTH = contentW * 0.8;
  const DIALOG_DEFAULT_LEFT = contentW * 0.1;
  const dialogLeft = getStickyLeft(winX, DIALOG_DEFAULT_LEFT, DIALOG_WIDTH);
  const SETTINGS_DEFAULT_TOP = contentW * 0.1;
  const SETTINGS_HEIGHT = contentW * 0.8;
  const settingsLeft = getStickyLeft(winX, DIALOG_DEFAULT_LEFT, DIALOG_WIDTH);
  const settingsTop = getStickyTop(winY, SETTINGS_DEFAULT_TOP, SETTINGS_HEIGHT);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          inset: 0,
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          handleContextMenu();
        }}
      >
        <PetScene
          emotion={emotion}
          selectedCharacter={selectedCharacter}
          onPointerDown={handlePointerDown}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
      </div>

      {/* Idle reminder bubble */}
      {reminder && !showChat && !showSettings && (
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: 20,
            fontSize: 13,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            animation: "fadeIn 0.3s ease-out"
          }}
        >
          {reminder}
        </div>
      )}

      {showChat && (
        <div
          style={{
            position: "absolute",
            top: "55%",
            left: dialogLeft,
            width: DIALOG_WIDTH,
            transition: "left 0.15s ease-out, width 0.15s ease-out",
          }}
        >
          <ChatDialog
            onClose={handleCloseChat}
            onSendMessage={handleSendMessage}
            messages={messages}
            conversations={conversations}
            currentConversationId={currentConversationId}
            onNewConversation={onNewConversation}
            onSwitchConversation={onSwitchConversation}
            onDeleteConversation={onDeleteConversation}
            todoKey={todoVersion}
          />
        </div>
      )}

      {showSettings && (
        <div
          style={{
            position: "absolute",
            top: settingsTop,
            left: settingsLeft,
            width: DIALOG_WIDTH,
            height: SETTINGS_HEIGHT,
            transition: "top 0.15s ease-out, left 0.15s ease-out, width 0.15s ease-out, height 0.15s ease-out",
          }}
        >
          <Settings
            config={settings}
            onSave={setSettings}
            onClose={handleCloseSettings}
            selectedCharacter={selectedCharacter}
            onCharacterChange={handleCharacterChange}
          />
        </div>
      )}
    </div>
  );
}

export default App;
