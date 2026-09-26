 // Scroll reveal
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));

  // Language bars
  const barIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const f = e.target.querySelector('.lang-fill');
        if (f) f.style.transform = `scaleX(${f.dataset.w})`;
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.lang-item').forEach(el => barIO.observe(el));

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // ==========================================================================
  // CRYPTOX INTERACTIVE PROTOTYPE LOGIC
  // ==========================================================================
  const projectRow = document.getElementById('project-cryptox');
  const projectAside = document.getElementById('cryptox-aside');
  const protoContainer = document.getElementById('cryptox-proto');
  const closeBtn = document.getElementById('cx-close-btn');
  const signinScreen = document.getElementById('cx-screen-signin');
  const chatScreen = document.getElementById('cx-screen-chat');
  const signinSubmit = document.getElementById('cx-signin-submit');
  const submitText = document.getElementById('cx-submit-text');
  const submitArrow = document.getElementById('cx-submit-arrow');
  const signoutBtn = document.getElementById('cx-signout-btn');
  const msgInput = document.getElementById('cx-message-input-field');
  const chatInputForm = document.getElementById('cx-chat-input-form');
  const messagesList = document.getElementById('cx-messages-list');
  const clearTextBtn = document.getElementById('cx-clear-text-btn');
  const micBtn = document.getElementById('cx-mic-btn');
  
  // Enter prototype mode
  if (projectAside) {
    projectAside.addEventListener('click', () => {
      projectRow.classList.add('prototype-active');
      protoContainer.style.display = 'flex';
      signinScreen.style.display = 'flex';
      chatScreen.style.display = 'none';
      
      resetPrototype();
      
      // Scroll into view nicely
      projectRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Close prototype mode
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid triggering aside click again
      projectRow.classList.remove('prototype-active');
      protoContainer.style.display = 'none';
    });
  }

  // Handle Sign In Click
  if (signinSubmit) {
    signinSubmit.addEventListener('click', () => {
      // Simulate auth handshake
      signinSubmit.disabled = true;
      signinSubmit.style.background = '#5b21b6';
      submitText.innerHTML = '<div class="cx-spinner" style="display:inline-block; vertical-align:middle; margin-right:8px;"></div>Authenticating...';
      submitArrow.style.display = 'none';
      
      setTimeout(() => {
        // Transition to Chat Screen
        signinScreen.style.display = 'none';
        chatScreen.style.display = 'flex';
        
        // Reset submit button state
        signinSubmit.disabled = false;
        signinSubmit.style.background = '';
        submitText.textContent = 'Sign In';
        submitArrow.style.display = 'inline-block';
        
        // Scroll the message list to bottom
        messagesList.scrollTop = messagesList.scrollHeight;
      }, 1200);
    });
  }

  // Sign out
  if (signoutBtn) {
    signoutBtn.addEventListener('click', () => {
      chatScreen.style.display = 'none';
      signinScreen.style.display = 'flex';
    });
  }

  // Reset function
  function resetPrototype() {
    // Clear custom messages added during run
    const customMsgs = messagesList.querySelectorAll('.cx-custom-message');
    customMsgs.forEach(m => m.remove());
    msgInput.value = '';
    
    // Reset audio player if animating
    stopAudioAnimation();
  }

  // Send message interactivity
  if (chatInputForm) {
    chatInputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = msgInput.value.trim();
      if (!text) return;
      
      appendMessage('You', text, 'sent', true);
      msgInput.value = '';
      
      // Simulate auto-response after 1.5 seconds if sending first message
      setTimeout(() => {
        const responses = [
          "Secure handshake verified. Message integrity check passed (HMAC-SHA256).",
          "Session key rotated automatically.",
          "Received! Your signature matches key footprint 0x9F8B...",
          "Decrypting payload... verification success."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        appendMessage('rozix', randomResponse, 'received', false);
      }, 1500);
    });
  }

  // Clear input text
  if (clearTextBtn) {
    clearTextBtn.addEventListener('click', () => {
      msgInput.value = '';
    });
  }

  // Mic simulation
  if (micBtn) {
    micBtn.addEventListener('click', () => {
      msgInput.value = "[Voice Recording Mode: AES-256 stream initialized...]";
    });
  }

  function appendMessage(sender, text, type, isCustom) {
    const msgRow = document.createElement('div');
    msgRow.className = `cx-message-row cx-msg-${type}`;
    if (isCustom) msgRow.classList.add('cx-custom-message');
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString([], { day: 'numeric', month: 'short' });
    
    const bubbleClass = type === 'sent' ? 'bg-purple-bubble' : '';
    const metaClass = type === 'sent' ? 'text-purple-light' : '';
    
    msgRow.innerHTML = `
      <div class="cx-msg-bubble ${bubbleClass}">
        <div class="cx-msg-sender">${sender}</div>
        <div class="cx-msg-text">${escapeHtml(text)}</div>
        <div class="cx-msg-meta ${metaClass}">${dateStr}, ${timeStr} · signature verified</div>
      </div>
    `;
    
    messagesList.appendChild(msgRow);
    messagesList.scrollTop = messagesList.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  // Audio Play Simulation
  const audioPlayBtn = document.getElementById('cx-audio-play');
  const waveformSpans = document.querySelectorAll('.cx-waveform span');
  let audioInterval = null;
  let isPlaying = false;

  if (audioPlayBtn) {
    audioPlayBtn.addEventListener('click', () => {
      if (isPlaying) {
        stopAudioAnimation();
      } else {
        startAudioAnimation();
      }
    });
  }

  function startAudioAnimation() {
    isPlaying = true;
    audioPlayBtn.textContent = '⏸';
    audioPlayBtn.style.background = '#7c3aed';
    
    // Animate waveform bars bouncing
    audioInterval = setInterval(() => {
      waveformSpans.forEach(span => {
        // Random variance in height
        const height = Math.floor(Math.random() * 20) + 6;
        span.style.height = `${height}px`;
        span.style.background = '#c084fc';
      });
    }, 150);
  }

  function stopAudioAnimation() {
    isPlaying = false;
    if (audioPlayBtn) {
      audioPlayBtn.textContent = '▶';
      audioPlayBtn.style.background = '';
    }
    clearInterval(audioInterval);
    
    // Reset to default heights
    const defaultHeights = [10, 16, 8, 18, 24, 12, 14, 26, 20, 10, 6, 18, 22, 16, 12, 24, 18, 10, 8, 16, 22, 14, 8, 12, 18];
    waveformSpans.forEach((span, idx) => {
      if (defaultHeights[idx] !== undefined) {
        span.style.height = `${defaultHeights[idx]}px`;
        span.style.background = '';
      }
    });
  }

  // Sidebar Chats interaction
  const chatItems = document.querySelectorAll('.cx-chat-item');
  const chatPaneHeader = document.querySelector('.cx-chat-pane-header');

  chatItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active from all
      chatItems.forEach(i => i.classList.remove('cx-active'));
      const statusTextEls = document.querySelectorAll('.cx-chat-item-status');
      statusTextEls.forEach(el => {
        el.classList.remove('text-purple');
      });
      
      // Make active
      item.classList.add('cx-active');
      const statusEl = item.querySelector('.cx-chat-item-status');
      if (statusEl) statusEl.classList.add('text-purple');
      
      const name = item.querySelector('.cx-chat-item-name').textContent;
      chatPaneHeader.textContent = name.toUpperCase();
      
      // Clear messages and add greeting
      resetPrototype();
      
      // Add mock encryption system note or welcome message
      setTimeout(() => {
        if (name === 'Admin') {
          appendMessage('Admin', 'System alert: Emergency key revocation protocol initialized. Awaiting certificate renewal.', 'received', false);
        } else if (name === 'rahma') {
          appendMessage('rahma', 'Hey! Did you finish auditing the AES decryption routines?', 'received', false);
        } else if (name === 'rozix') {
          appendMessage('rozix', 'hey giiirl', 'received', false);
          appendMessage('You', 'hiiii my wifiiiiiii!!!', 'sent', false);
          
          // Add voice msg
          const voiceRow = document.createElement('div');
          voiceRow.className = `cx-message-row cx-msg-sent cx-custom-message`;
          voiceRow.innerHTML = `
            <div class="cx-msg-bubble bg-purple-bubble cx-msg-voice">
              <div class="cx-msg-sender">You</div>
              <div class="cx-voice-player">
                <button class="cx-play-btn" id="cx-audio-play-custom">▶</button>
                <div class="cx-waveform-custom cx-waveform">
                  <span></span><span></span><span></span><span></span><span></span>
                  <span></span><span></span><span></span><span></span><span></span>
                  <span></span><span></span><span></span><span></span><span></span>
                  <span></span><span></span><span></span><span></span><span></span>
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
                <span class="cx-duration">0:52</span>
                <button class="cx-more-btn" onclick="return false;">⋮</button>
              </div>
              <div class="cx-msg-meta text-purple-light">15 Apr, 18:20 · signature verified · SHA-256 file hash verified</div>
            </div>
          `;
          messagesList.appendChild(voiceRow);
          
          // Re-init voice btn listeners
          const customPlay = document.getElementById('cx-audio-play-custom');
          const customSpans = voiceRow.querySelectorAll('.cx-waveform-custom span');
          
          const defaultHeights = [10, 16, 8, 18, 24, 12, 14, 26, 20, 10, 6, 18, 22, 16, 12, 24, 18, 10, 8, 16, 22, 14, 8, 12, 18];
          customSpans.forEach((span, idx) => {
            span.style.height = `${defaultHeights[idx]}px`;
          });
          
          let customPlaying = false;
          let customInterval = null;
          customPlay.addEventListener('click', () => {
            if (customPlaying) {
              customPlaying = false;
              customPlay.textContent = '▶';
              customPlay.style.background = '';
              clearInterval(customInterval);
              customSpans.forEach((span, idx) => {
                span.style.height = `${defaultHeights[idx]}px`;
                span.style.background = '';
              });
            } else {
              customPlaying = true;
              customPlay.textContent = '⏸';
              customPlay.style.background = '#7c3aed';
              customInterval = setInterval(() => {
                customSpans.forEach(span => {
                  const height = Math.floor(Math.random() * 20) + 6;
                  span.style.height = `${height}px`;
                  span.style.background = '#c084fc';
                });
              }, 150);
            }
          });
          
          messagesList.scrollTop = messagesList.scrollHeight;
        } else if (name === 'pook') {
          appendMessage('pook', '[Group Session Key verified] Welcome to the core security board.', 'received', false);
          appendMessage('rahma', 'Are we moving the AWS EC2 instance to the private subnet tonight?', 'received', false);
        }
      }, 300);
    });
  });

  // ==========================================================================
  // VOXKEY INTERACTIVE PROTOTYPE LOGIC
  // ==========================================================================
  const vkRow = document.getElementById('project-voxkey');
  const vkAside = document.getElementById('voxkey-aside');
  const vkContainer = document.getElementById('voxkey-proto');
  const vkCloseBtn = document.getElementById('vk-close-btn');

  const vkTabLogin = document.getElementById('vk-tab-login');
  const vkTabVoice = document.getElementById('vk-tab-voice');
  const vkTabKeyboard = document.getElementById('vk-tab-keyboard');

  const vkViewLogin = document.getElementById('vk-view-login');
  const vkViewVoice = document.getElementById('vk-view-voice');
  const vkViewKeyboard = document.getElementById('vk-view-keyboard');
  const vkLoginHotspot = document.getElementById('vk-login-hotspot');

  if (vkAside) {
    vkAside.addEventListener('click', () => {
      vkRow.classList.add('prototype-active');
      vkContainer.style.display = 'flex';
      switchVkTab('login');
      vkRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  if (vkCloseBtn) {
    vkCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      vkRow.classList.remove('prototype-active');
      vkContainer.style.display = 'none';
    });
  }

  function switchVkTab(tab) {
    [vkTabLogin, vkTabVoice, vkTabKeyboard].forEach(t => t && t.classList.remove('active'));
    [vkViewLogin, vkViewVoice, vkViewKeyboard].forEach(v => v && (v.style.display = 'none'));

    if (tab === 'login') {
      if (vkTabLogin) vkTabLogin.classList.add('active');
      if (vkViewLogin) vkViewLogin.style.display = 'block';
    } else if (tab === 'voice') {
      if (vkTabVoice) vkTabVoice.classList.add('active');
      if (vkViewVoice) vkViewVoice.style.display = 'block';
    } else if (tab === 'keyboard') {
      if (vkTabKeyboard) vkTabKeyboard.classList.add('active');
      if (vkViewKeyboard) vkViewKeyboard.style.display = 'block';
    }
  }

  if (vkTabLogin) vkTabLogin.addEventListener('click', () => switchVkTab('login'));
  if (vkTabVoice) vkTabVoice.addEventListener('click', () => switchVkTab('voice'));
  if (vkTabKeyboard) vkTabKeyboard.addEventListener('click', () => switchVkTab('keyboard'));
  if (vkLoginHotspot) vkLoginHotspot.addEventListener('click', () => switchVkTab('voice'));

  // ==========================================================================
  // DOCUMENT SEARCH INTERACTIVE PROTOTYPE LOGIC
  // ==========================================================================
  const dsRow = document.getElementById('project-docsearch');
  const dsAside = document.getElementById('docsearch-aside');
  const dsContainer = document.getElementById('tdsa-proto');
  const dsCloseBtn = document.getElementById('tdsa-close-btn');
  const dsViews = document.querySelectorAll('.tdsa-view');

  function switchDocSearchTab(tabName) {
    dsViews.forEach(view => {
      const isActive = view.dataset.tdsaView === tabName;
      view.style.display = isActive ? 'flex' : 'none';
    });
  }

  function submitDocSearch(sourceInput) {
    const query = sourceInput.value.trim();
    const resultsInput = document.querySelector('[data-tdsa-view="search"] [data-tdsa-search-input]');
    const feedback = document.getElementById('tdsa-search-feedback');
    if (resultsInput) resultsInput.value = query;
    if (feedback) feedback.textContent = query ? `Showing indexed results for "${query}"` : 'Showing all indexed documents';
    switchDocSearchTab('search');
  }

  if (dsAside) {
    dsAside.addEventListener('click', () => {
      if (!dsRow || !dsContainer) return;
      dsRow.classList.add('prototype-active');
      dsContainer.style.display = 'flex';
      switchDocSearchTab('login');
      dsRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  if (dsCloseBtn) {
    dsCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!dsRow || !dsContainer) return;
      dsRow.classList.remove('prototype-active');
      dsContainer.style.display = 'none';
    });
  }

  document.querySelectorAll('.tdsa-hotspot').forEach(hotspot => {
    hotspot.addEventListener('click', () => switchDocSearchTab(hotspot.dataset.tdsaGo));
  });

  document.querySelectorAll('[data-tdsa-search-form]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const searchInput = form.querySelector('[data-tdsa-search-input]');
      if (searchInput) submitDocSearch(searchInput);
    });

    const searchInput = form.querySelector('[data-tdsa-search-input]');
    if (searchInput) {
      searchInput.addEventListener('keyup', event => {
        if (event.key === 'Enter') submitDocSearch(searchInput);
      });
    }
  });

  const uploadButton = document.querySelector('[data-tdsa-upload-submit]');
  const uploadFeedback = document.getElementById('tdsa-upload-feedback');
  if (uploadButton && uploadFeedback) {
    uploadButton.addEventListener('click', () => {
      const title = document.querySelector('[aria-label="Document title"]');
      const file = document.querySelector('[aria-label="Choose document file"]');
      uploadFeedback.textContent = title && title.value && file && file.files.length
        ? `${title.value} is ready to be indexed.`
        : 'Enter a title and choose a document to continue.';
      uploadFeedback.classList.add('visible');
    });
  }

  // ==========================================================================
  // PC-AGENT INTERACTIVE SEQUENCE LOGIC
  // ==========================================================================
  const pcRow = document.getElementById('project-pcagent');
  const pcAside = document.getElementById('pcagent-aside');
  const pcContainer = document.getElementById('pcagent-proto');
  const pcCloseBtn = document.getElementById('pcagent-close-btn');
  const pcImage = document.getElementById('pcagent-image');
  const pcPrev = document.getElementById('pcagent-prev');
  const pcNext = document.getElementById('pcagent-next');
  const pcCounter = document.getElementById('pcagent-counter');
  const pcFrames = ['images/1.png', 'images/2.png', 'images/3.png', 'images/4.png', 'images/5.png', 'images/6.png', 'images/7.png'];
  let pcFrameIndex = 0;

  function updatePcAgentFrame() {
    if (!pcImage || !pcCounter) return;

    pcImage.src = pcFrames[pcFrameIndex];
    pcImage.alt = `PC Agent sequence frame ${pcFrameIndex + 1}`;
    pcCounter.textContent = `${pcFrameIndex + 1} / ${pcFrames.length}`;

    if (pcPrev) pcPrev.disabled = pcFrameIndex === 0;
    if (pcNext) {
      pcNext.textContent = pcFrameIndex === pcFrames.length - 1 ? 'Replay' : 'Next';
    }
  }

  if (pcAside) {
    pcAside.addEventListener('click', () => {
      if (!pcRow || !pcContainer) return;
      pcRow.classList.add('prototype-active');
      pcContainer.style.display = 'flex';
      pcFrameIndex = 0;
      updatePcAgentFrame();
      pcRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  if (pcCloseBtn) {
    pcCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!pcRow || !pcContainer) return;
      pcRow.classList.remove('prototype-active');
      pcContainer.style.display = 'none';
    });
  }

  if (pcPrev) {
    pcPrev.addEventListener('click', () => {
      if (pcFrameIndex > 0) {
        pcFrameIndex -= 1;
        updatePcAgentFrame();
      }
    });
  }

  if (pcNext) {
    pcNext.addEventListener('click', () => {
      if (pcFrameIndex < pcFrames.length - 1) {
        pcFrameIndex += 1;
      } else {
        pcFrameIndex = 0;
      }
      updatePcAgentFrame();
    });
  }

  if (pcContainer) {
    pcContainer.addEventListener('click', (event) => {
      if (event.target === pcContainer || event.target.closest('.pcagent-stage')) {
        if (pcFrameIndex < pcFrames.length - 1) {
          pcFrameIndex += 1;
          updatePcAgentFrame();
        } else {
          pcFrameIndex = 0;
          updatePcAgentFrame();
        }
      }
    });
  }

  // ========================================================================
  // FROG COMPILER SCREEN PROTOTYPE
  // ========================================================================
  const frogRow = document.getElementById('project-frog');
  const frogAside = document.getElementById('frog-aside');
  const frogContainer = document.getElementById('frog-proto');
  const frogCloseBtn = document.getElementById('frog-close-btn');
  const frogImage = document.getElementById('frog-screen-image');
  const frogCurrentView = document.getElementById('frog-current-view');
  const frogScreens = {
    main: { src: 'images/Frog-main.png', label: 'Main' },
    lexical: { src: 'images/Frog-lexical.png', label: 'Lexical Analysis' },
    syntaxique: { src: 'images/Frog-syntaxique.png', label: 'Syntax Analysis' },
    semantique: { src: 'images/Frog-semantique.png', label: 'Semantic Analysis' },
    minimap: { src: 'images/Frog-minimap.png', label: 'Mini Map' }
  };

  function showFrogScreen(screenName) {
    const screen = frogScreens[screenName];
    if (!screen || !frogImage) return;
    frogImage.src = screen.src;
    frogImage.alt = `FROG compiler ${screen.label.toLowerCase()} screen`;
    if (frogCurrentView) frogCurrentView.textContent = screen.label;
  }

  if (frogAside) {
    frogAside.addEventListener('click', () => {
      if (!frogRow || !frogContainer) return;
      frogRow.classList.add('prototype-active');
      frogContainer.style.display = 'flex';
      showFrogScreen('main');
      frogRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  if (frogCloseBtn) {
    frogCloseBtn.addEventListener('click', event => {
      event.stopPropagation();
      if (!frogRow || !frogContainer) return;
      frogRow.classList.remove('prototype-active');
      frogContainer.style.display = 'none';
    });
  }

  document.querySelectorAll('.frog-hotspot').forEach(button => {
    button.addEventListener('click', () => showFrogScreen(button.dataset.frogScreen));
  });

