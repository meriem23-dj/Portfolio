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