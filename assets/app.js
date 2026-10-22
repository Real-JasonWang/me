
        let lastFocusedElementBeforeModal = null;

        const trapFocus = (modalElement) => {
            if (!modalElement) return;
            const focusableSelectors = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
            const focusableElements = Array.from(modalElement.querySelectorAll(focusableSelectors)).filter(el => {
                return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
            });
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            firstElement.focus();

            const handleTab = (e) => {
                if (e.key !== 'Tab') return;
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            };

            if (modalElement._handleTab) {
                modalElement.removeEventListener('keydown', modalElement._handleTab);
            }
            modalElement._handleTab = handleTab;
            modalElement.addEventListener('keydown', handleTab);
        };

        const releaseFocus = (modalElement) => {
            if (modalElement && modalElement._handleTab) {
                modalElement.removeEventListener('keydown', modalElement._handleTab);
                delete modalElement._handleTab;
            }
            if (lastFocusedElementBeforeModal && typeof lastFocusedElementBeforeModal.focus === 'function') {
                lastFocusedElementBeforeModal.focus();
                lastFocusedElementBeforeModal = null;
            }
        };

        window.openLightbox = function (src, title, caption) {
            if (window.__hydrateAssets) window.__hydrateAssets();
            const lightbox = document.getElementById('image-lightbox');
            const img = document.getElementById('lightbox-img');
            const titleEl = document.getElementById('lightbox-title');
            const captionEl = document.getElementById('lightbox-caption');
            if (!lightbox || !img) return;

            lastFocusedElementBeforeModal = document.activeElement;
            img.src = src;
            img.alt = title || 'Document Preview';
            if (titleEl) titleEl.textContent = title || 'Document Preview';
            if (captionEl) captionEl.textContent = caption || 'Press ESC or click backdrop to close';

            lightbox.setAttribute('aria-hidden', 'false');
            lightbox.classList.remove('hidden');
            const announcer = document.getElementById('a11y-announcer');
            if (announcer) announcer.textContent = (title || 'Document Preview') + ' modal opened. Press Escape to close.';
            requestAnimationFrame(() => {
                lightbox.classList.remove('opacity-0');
                lightbox.classList.add('flex', 'opacity-100');
                trapFocus(lightbox);
            });
        };

        window.closeLightbox = function (e) {
            const lightbox = document.getElementById('image-lightbox');
            if (!lightbox) return;
            lightbox.setAttribute('aria-hidden', 'true');
            lightbox.classList.remove('opacity-100');
            lightbox.classList.add('opacity-0');
            releaseFocus(lightbox);
            const announcerClose = document.getElementById('a11y-announcer');
            if (announcerClose) announcerClose.textContent = 'Preview modal closed.';
            setTimeout(() => {
                lightbox.classList.remove('flex');
                lightbox.classList.add('hidden');
            }, 250);
        };

        window.openUsphdModal = function () {
            if (window.__hydrateAssets) window.__hydrateAssets();
            const modal = document.getElementById('usphd-modal');
            const iframe = document.getElementById('usphd-modal-iframe');
            if (!modal || !iframe) return;

            lastFocusedElementBeforeModal = document.activeElement;
            const dataSrc = iframe.getAttribute('data-src');
            if (dataSrc && (!iframe.src || iframe.src === 'about:blank' || !iframe.src.includes('usphd/index.html'))) {
                iframe.src = dataSrc;
            }

            modal.setAttribute('aria-hidden', 'false');
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            requestAnimationFrame(() => {
                modal.classList.remove('opacity-0');
                modal.classList.add('flex', 'opacity-100');
                trapFocus(modal);
            });
        };

        window.closeUsphdModal = function (e) {
            const modal = document.getElementById('usphd-modal');
            if (!modal) return;
            modal.setAttribute('aria-hidden', 'true');
            modal.classList.remove('opacity-100');
            modal.classList.add('opacity-0');
            document.body.style.overflow = '';
            releaseFocus(modal);
            setTimeout(() => {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }, 250);
        };

        // 2026 Summer Research Exhibition - Cultural Fieldwork Carousel & Video Controller
        (function() {
            const travelPhotos = [
                'assets/summer_travel_2026/IMG_4443.png',
                'assets/summer_travel_2026/IMG_4486.png',
                'assets/summer_travel_2026/IMG_4536.png',
                'assets/summer_travel_2026/IMG_4576.png',
                'assets/summer_travel_2026/IMG_4705.png',
                'assets/summer_travel_2026/IMG_4737.png',
                'assets/summer_travel_2026/IMG_4760.png',
                'assets/summer_travel_2026/IMG_4829.png',
                'assets/summer_travel_2026/IMG_4831.png',
                'assets/summer_travel_2026/IMG_4845.png',
                'assets/summer_travel_2026/IMG_4862.png',
                'assets/summer_travel_2026/IMG_5416.png',
                'assets/summer_travel_2026/IMG_5479.png',
                'assets/summer_travel_2026/IMG_5506.png',
                'assets/summer_travel_2026/IMG_5581.png',
                'assets/summer_travel_2026/IMG_5666.png',
                'assets/summer_travel_2026/IMG_5731.png'
            ];
            let currentTravelIdx = 0;

            window.changeTravelPhoto = function(delta) {
                currentTravelIdx = (currentTravelIdx + delta + travelPhotos.length) % travelPhotos.length;
                renderCarousel();
            };

            window.setTravelPhoto = function(idx) {
                if (idx >= 0 && idx < travelPhotos.length) {
                    currentTravelIdx = idx;
                    renderCarousel();
                }
            };

            window.openActiveTravelLightbox = function() {
                const src = travelPhotos[currentTravelIdx];
                const num = String(currentTravelIdx + 1).padStart(2, '0');
                if (typeof window.openLightbox === 'function') {
                    window.openLightbox(src, 'Cultural Fieldwork Archive (' + num + ' / ' + travelPhotos.length + ')', 'Fieldwork exploration across Wuhan, Taiyuan, and Luoyang &mdash; Humanities and historical heritage inspiring algorithmic soundscapes.');
                }
            };

            function renderCarousel() {
                const img = document.getElementById('travel-carousel-img');
                const counter = document.getElementById('travel-carousel-counter');
                const dotsContainer = document.getElementById('travel-carousel-dots');
                if (img) {
                    img.src = travelPhotos[currentTravelIdx];
                    img.alt = 'Cultural Fieldwork in Wuhan, Taiyuan, Luoyang - Photo ' + (currentTravelIdx + 1);
                }
                if (counter) {
                    counter.textContent = String(currentTravelIdx + 1).padStart(2, '0') + ' / ' + travelPhotos.length;
                }
                if (dotsContainer) {
                    const dots = dotsContainer.querySelectorAll('button');
                    dots.forEach((dot, i) => {
                        if (i === currentTravelIdx) {
                            dot.className = 'w-3.5 h-1.5 rounded-full bg-neo transition-all flex-shrink-0';
                            dot.setAttribute('aria-current', 'true');
                        } else {
                            dot.className = 'w-1.5 h-1.5 rounded-full bg-white/20 hover:bg-white/50 transition-all flex-shrink-0';
                            dot.removeAttribute('aria-current');
                        }
                    });
                }
            }

            function initCarousel() {
                const dotsContainer = document.getElementById('travel-carousel-dots');
                if (dotsContainer) {
                    dotsContainer.innerHTML = '';
                    travelPhotos.forEach((_, i) => {
                        const btn = document.createElement('button');
                        btn.type = 'button';
                        btn.setAttribute('aria-label', 'Go to fieldwork photo ' + (i + 1));
                        btn.className = (i === 0) 
                            ? 'w-3.5 h-1.5 rounded-full bg-neo transition-all flex-shrink-0' 
                            : 'w-1.5 h-1.5 rounded-full bg-white/20 hover:bg-white/50 transition-all flex-shrink-0';
                        if (i === 0) btn.setAttribute('aria-current', 'true');
                        btn.onclick = () => window.setTravelPhoto(i);
                        dotsContainer.appendChild(btn);
                    });
                }

                // Keyboard arrow nav for carousel
                const carouselEl = document.getElementById('summer-travel-carousel');
                if (carouselEl) {
                    carouselEl.addEventListener('keydown', (e) => {
                        if (e.key === 'ArrowLeft') {
                            e.preventDefault();
                            window.changeTravelPhoto(-1);
                        } else if (e.key === 'ArrowRight') {
                            e.preventDefault();
                            window.changeTravelPhoto(1);
                        }
                    });
                }

                // Custom Cyber-Glass Video Player Controller
                const player = document.getElementById('custom-video-player');
                const video = document.getElementById('summer2026-video');
                if (!player || !video) return;

                const bigPlayBtn = document.getElementById('video-big-play-btn');
                const bigPlayWrap = document.getElementById('video-center-button-wrap');
                const bigPlayIcon = document.getElementById('video-big-play-icon');
                const playBtn = document.getElementById('video-play-btn');
                const playIcon = document.getElementById('video-play-icon');
                const rewindBtn = document.getElementById('video-rewind-btn');
                const muteBtn = document.getElementById('video-mute-btn');
                const volumeIcon = document.getElementById('video-volume-icon');
                const volumeSlider = document.getElementById('video-volume-slider');
                const currentTimeEl = document.getElementById('video-current-time');
                const durationEl = document.getElementById('video-duration');
                const progressContainer = document.getElementById('video-progress-container');
                const progressBar = document.getElementById('video-progress-bar');
                const bufferBar = document.getElementById('video-buffer-bar');
                const scrubberThumb = document.getElementById('video-scrubber-thumb');
                const fullscreenBtn = document.getElementById('video-fullscreen-btn');
                const fsIcon = document.getElementById('video-fs-icon');
                const controlsBar = document.getElementById('video-controls-bar');
                const topHud = document.getElementById('video-top-hud');

                let hideControlsTimer = null;
                let isScrubbing = false;

                const formatTime = (seconds) => {
                    if (isNaN(seconds) || seconds < 0) return '0:00';
                    const mins = Math.floor(seconds / 60);
                    const secs = Math.floor(seconds % 60);
                    return mins + ':' + (secs < 10 ? '0' : '') + secs;
                };

                const updatePlayState = (isPlaying) => {
                    if (isPlaying) {
                        if (playIcon) playIcon.className = 'fa-solid fa-pause text-[10px]';
                        if (bigPlayIcon) bigPlayIcon.className = 'fa-solid fa-pause text-lg md:text-xl';
                        if (playBtn) playBtn.setAttribute('aria-label', 'Pause video');
                        if (bigPlayWrap) bigPlayWrap.classList.add('opacity-0', 'pointer-events-none');
                        scheduleControlsHide();
                    } else {
                        if (playIcon) playIcon.className = 'fa-solid fa-play text-[10px]';
                        if (bigPlayIcon) bigPlayIcon.className = 'fa-solid fa-play text-lg md:text-xl translate-x-0.5';
                        if (playBtn) playBtn.setAttribute('aria-label', 'Play video');
                        if (bigPlayWrap) bigPlayWrap.classList.remove('opacity-0', 'pointer-events-none');
                        showControls();
                    }
                };

                const togglePlay = () => {
                    if (video.paused || video.ended) {
                        video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                };

                const showControls = () => {
                    if (controlsBar) controlsBar.classList.remove('opacity-0', 'pointer-events-none');
                    if (topHud) topHud.classList.remove('opacity-0');
                    clearTimeout(hideControlsTimer);
                };

                const scheduleControlsHide = () => {
                    clearTimeout(hideControlsTimer);
                    if (!video.paused && !video.ended && !isScrubbing) {
                        hideControlsTimer = setTimeout(() => {
                            if (!video.paused && !isScrubbing) {
                                if (controlsBar) controlsBar.classList.add('opacity-0', 'pointer-events-none');
                                if (topHud) topHud.classList.add('opacity-0');
                            }
                        }, 2500);
                    }
                };

                if (bigPlayBtn) bigPlayBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });
                if (bigPlayWrap) bigPlayWrap.addEventListener('click', () => togglePlay());
                if (playBtn) playBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });
                video.addEventListener('click', () => togglePlay());

                video.addEventListener('play', () => updatePlayState(true));
                video.addEventListener('pause', () => updatePlayState(false));
                video.addEventListener('ended', () => {
                    updatePlayState(false);
                    if (bigPlayIcon) bigPlayIcon.className = 'fa-solid fa-rotate-left text-lg md:text-xl';
                    if (playIcon) playIcon.className = 'fa-solid fa-rotate-left text-[10px]';
                });

                if (rewindBtn) {
                    rewindBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        video.currentTime = Math.max(0, video.currentTime - 10);
                        showControls();
                        scheduleControlsHide();
                    });
                }

                video.addEventListener('timeupdate', () => {
                    if (!isScrubbing && video.duration) {
                        const pct = (video.currentTime / video.duration) * 100;
                        if (progressBar) progressBar.style.width = pct + '%';
                        if (scrubberThumb) scrubberThumb.style.left = pct + '%';
                        if (progressContainer) progressContainer.setAttribute('aria-valuenow', Math.round(pct));
                    }
                    if (currentTimeEl) currentTimeEl.textContent = formatTime(video.currentTime);
                });

                video.addEventListener('loadedmetadata', () => {
                    if (durationEl) durationEl.textContent = formatTime(video.duration);
                });

                video.addEventListener('progress', () => {
                    if (video.buffered.length > 0 && video.duration) {
                        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                        const bufPct = (bufferedEnd / video.duration) * 100;
                        if (bufferBar) bufferBar.style.width = bufPct + '%';
                    }
                });

                const seekFromEvent = (e) => {
                    if (!progressContainer || !video.duration) return;
                    const rect = progressContainer.getBoundingClientRect();
                    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
                    video.currentTime = pos * video.duration;
                    const pct = pos * 100;
                    if (progressBar) progressBar.style.width = pct + '%';
                    if (scrubberThumb) scrubberThumb.style.left = pct + '%';
                    if (progressContainer) progressContainer.setAttribute('aria-valuenow', Math.round(pct));
                };

                if (progressContainer) {
                    progressContainer.addEventListener('mousedown', (e) => {
                        isScrubbing = true;
                        seekFromEvent(e);
                        const onMouseMove = (ev) => seekFromEvent(ev);
                        const onMouseUp = () => {
                            isScrubbing = false;
                            document.removeEventListener('mousemove', onMouseMove);
                            document.removeEventListener('mouseup', onMouseUp);
                            scheduleControlsHide();
                        };
                        document.addEventListener('mousemove', onMouseMove);
                        document.addEventListener('mouseup', onMouseUp);
                    });

                    progressContainer.addEventListener('touchstart', (e) => {
                        isScrubbing = true;
                        seekFromEvent(e);
                    }, { passive: true });

                    progressContainer.addEventListener('touchmove', (e) => {
                        if (isScrubbing) seekFromEvent(e);
                    }, { passive: true });

                    progressContainer.addEventListener('touchend', () => {
                        isScrubbing = false;
                        scheduleControlsHide();
                    });

                    progressContainer.addEventListener('keydown', (e) => {
                        if (!video.duration) return;
                        if (e.key === 'ArrowLeft') {
                            e.preventDefault();
                            video.currentTime = Math.max(0, video.currentTime - 5);
                        } else if (e.key === 'ArrowRight') {
                            e.preventDefault();
                            video.currentTime = Math.min(video.duration, video.currentTime + 5);
                        }
                    });
                }

                let lastVolume = 1;
                const updateVolumeUI = () => {
                    if (video.muted || video.volume === 0) {
                        if (volumeIcon) volumeIcon.className = 'fa-solid fa-volume-xmark text-[10px] text-red-400';
                        if (volumeSlider) volumeSlider.value = 0;
                        if (muteBtn) muteBtn.setAttribute('aria-label', 'Unmute sound');
                    } else {
                        if (volumeIcon) volumeIcon.className = video.volume > 0.5 
                            ? 'fa-solid fa-volume-high text-[10px] text-acid' 
                            : 'fa-solid fa-volume-low text-[10px] text-acid';
                        if (volumeSlider) volumeSlider.value = video.volume;
                        if (muteBtn) muteBtn.setAttribute('aria-label', 'Mute sound');
                    }
                };

                if (muteBtn) {
                    muteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (video.muted) {
                            video.muted = false;
                            video.volume = lastVolume > 0 ? lastVolume : 0.8;
                        } else {
                            lastVolume = video.volume;
                            video.muted = true;
                        }
                        updateVolumeUI();
                    });
                }

                if (volumeSlider) {
                    volumeSlider.addEventListener('input', (e) => {
                        e.stopPropagation();
                        const val = parseFloat(e.target.value);
                        video.volume = val;
                        video.muted = (val === 0);
                        lastVolume = val > 0 ? val : lastVolume;
                        updateVolumeUI();
                    });
                }

                const toggleFullscreen = () => {
                    const fsElement = document.fullscreenElement || document.webkitFullscreenElement;
                    if (!fsElement) {
                        if (player.requestFullscreen) {
                            player.requestFullscreen().catch(() => {});
                        } else if (player.webkitRequestFullscreen) {
                            player.webkitRequestFullscreen();
                        }
                    } else {
                        if (document.exitFullscreen) {
                            document.exitFullscreen().catch(() => {});
                        } else if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen();
                        }
                    }
                };

                if (fullscreenBtn) fullscreenBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleFullscreen(); });

                const onFsChange = () => {
                    const isFs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
                    if (fsIcon) {
                        fsIcon.className = isFs ? 'fa-solid fa-compress text-[10px]' : 'fa-solid fa-expand text-[10px]';
                    }
                    if (fullscreenBtn) {
                        fullscreenBtn.setAttribute('aria-label', isFs ? 'Exit Fullscreen' : 'Enter Fullscreen');
                    }
                };
                document.addEventListener('fullscreenchange', onFsChange);
                document.addEventListener('webkitfullscreenchange', onFsChange);

                player.addEventListener('mousemove', () => {
                    showControls();
                    scheduleControlsHide();
                });
                player.addEventListener('mouseleave', () => {
                    if (!video.paused && !video.ended) {
                        if (controlsBar) controlsBar.classList.add('opacity-0', 'pointer-events-none');
                        if (topHud) topHud.classList.add('opacity-0');
                    }
                });

                player.addEventListener('keydown', (e) => {
                    if (e.target === progressContainer) return;
                    if (e.key === ' ' || e.key === 'k') {
                        e.preventDefault();
                        togglePlay();
                    } else if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        video.currentTime = Math.max(0, video.currentTime - 5);
                        showControls();
                        scheduleControlsHide();
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        video.currentTime = Math.min(video.duration || 333, video.currentTime + 5);
                        showControls();
                        scheduleControlsHide();
                    } else if (e.key === 'm' || e.key === 'M') {
                        e.preventDefault();
                        video.muted = !video.muted;
                        updateVolumeUI();
                    } else if (e.key === 'f' || e.key === 'F') {
                        e.preventDefault();
                        toggleFullscreen();
                    }
                });
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initCarousel);
            } else {
                initCarousel();
            }
        })();

        window.openWarningModal = function () {
            const modal = document.getElementById('warning-modal');
            const card = document.getElementById('warning-modal-card');
            if (!modal) return;

            lastFocusedElementBeforeModal = document.activeElement;
            modal.setAttribute('aria-hidden', 'false');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            void modal.offsetWidth;
            requestAnimationFrame(() => {
                modal.classList.remove('opacity-0');
                modal.classList.add('opacity-100');
                if (card) {
                    card.classList.remove('scale-90', 'translate-y-8', 'opacity-0');
                    card.classList.add('scale-100', 'translate-y-0', 'opacity-100');
                }
                trapFocus(modal);
            });
        };

        window.closeWarningModal = function (e) {
            const modal = document.getElementById('warning-modal');
            const card = document.getElementById('warning-modal-card');
            if (!modal) return;
            modal.setAttribute('aria-hidden', 'true');
            modal.classList.remove('opacity-100');
            modal.classList.add('opacity-0');
            if (card) {
                card.classList.remove('scale-100', 'translate-y-0', 'opacity-100');
                card.classList.add('scale-95', 'translate-y-4', 'opacity-0');
            }
            releaseFocus(modal);
            setTimeout(() => {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }, 300);
        };

        window.openHireModal = function (e) {
            if (e && typeof e.preventDefault === 'function') e.preventDefault();
            if (window.__hydrateAssets) window.__hydrateAssets();

            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('opacity-0')) {
                const mobileMenuBtn = document.getElementById('mobile-menu-btn');
                if (mobileMenuBtn) mobileMenuBtn.click();
            }

            const modal = document.getElementById('hire-modal');
            const card = document.getElementById('hire-modal-card');
            if (!modal) return;

            const form = document.getElementById('hire-contact-form');
            const successView = document.getElementById('hire-success-view');
            const alertBox = document.getElementById('hire-form-alert');
            if (form) form.classList.remove('hidden');
            if (successView) {
                successView.classList.add('hidden');
                successView.classList.remove('flex');
            }
            if (alertBox) {
                alertBox.classList.add('hidden');
                alertBox.textContent = '';
                alertBox.innerHTML = '';
            }

            // Close dropdown menu if open
            const dropdownMenu = document.getElementById('hire-type-menu');
            if (dropdownMenu && !dropdownMenu.classList.contains('hidden')) {
                dropdownMenu.classList.add('hidden');
                dropdownMenu.classList.remove('flex');
                const chevron = document.getElementById('hire-type-chevron');
                if (chevron) chevron.classList.remove('rotate-180');
            }

            lastFocusedElementBeforeModal = document.activeElement;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            modal.removeAttribute('aria-hidden');

            const hireAnnouncer = document.getElementById('a11y-announcer');
            if (hireAnnouncer) hireAnnouncer.textContent = 'Hire Jason modal dialog opened. Press Escape to close.';
            requestAnimationFrame(() => {
                modal.classList.remove('opacity-0');
                modal.classList.add('opacity-100');
                if (card) {
                    card.classList.remove('scale-90', 'translate-y-6', 'opacity-0');
                    card.classList.add('scale-100', 'translate-y-0', 'opacity-100');
                }
                trapFocus(modal);
                const firstInput = document.getElementById('hire-name');
                if (firstInput) firstInput.focus();
            });
        };

        window.closeHireModal = function (e) {
            const hireAnnounceClose = document.getElementById('a11y-announcer');
            if (hireAnnounceClose) hireAnnounceClose.textContent = 'Hire modal closed.';
            const modal = document.getElementById('hire-modal');
            const card = document.getElementById('hire-modal-card');
            if (!modal) return;
            const dropdownMenu = document.getElementById('hire-type-menu');
            if (dropdownMenu && !dropdownMenu.classList.contains('hidden')) {
                dropdownMenu.classList.add('hidden');
                dropdownMenu.classList.remove('flex');
                const chevron = document.getElementById('hire-type-chevron');
                if (chevron) chevron.classList.remove('rotate-180');
            }
            modal.setAttribute('aria-hidden', 'true');
            modal.classList.remove('opacity-100');
            modal.classList.add('opacity-0');
            if (card) {
                card.classList.remove('scale-100', 'translate-y-0', 'opacity-100');
                card.classList.add('scale-90', 'translate-y-6', 'opacity-0');
            }
            releaseFocus(modal);
            setTimeout(() => {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }, 300);
        };

        let hireActiveOptionIndex = 0;

        window.toggleHireDropdown = function (e, forceState) {
            if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
            const menu = document.getElementById('hire-type-menu');
            const chevron = document.getElementById('hire-type-chevron');
            const btn = document.getElementById('hire-type-btn');
            if (!menu) return;

            const shouldOpen = typeof forceState === 'boolean' ? forceState : menu.classList.contains('hidden');

            if (shouldOpen) {
                menu.classList.remove('hidden');
                menu.classList.add('flex');
                if (chevron) chevron.classList.add('rotate-180');
                if (btn) btn.setAttribute('aria-expanded', 'true');
                updateActiveDropdownOption(hireActiveOptionIndex, false);
            } else {
                menu.classList.add('hidden');
                menu.classList.remove('flex');
                if (chevron) chevron.classList.remove('rotate-180');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            }
        };

        const updateActiveDropdownOption = function (index, scrollIntoView = true) {
            const options = document.querySelectorAll('.hire-option');
            if (options.length === 0) return;
            if (index < 0) index = 0;
            if (index >= options.length) index = options.length - 1;
            hireActiveOptionIndex = index;

            const btn = document.getElementById('hire-type-btn');
            options.forEach((opt, idx) => {
                const isFocused = idx === index;
                if (isFocused) {
                    opt.classList.add('bg-white/10', 'outline-none', 'ring-1', 'ring-cyan/40');
                    if (btn) btn.setAttribute('aria-activedescendant', opt.id);
                    if (scrollIntoView && typeof opt.scrollIntoView === 'function') {
                        opt.scrollIntoView({ block: 'nearest' });
                    }
                } else {
                    opt.classList.remove('bg-white/10', 'outline-none', 'ring-1', 'ring-cyan/40');
                }
            });
        };

        window.selectHireOption = function (value, iconClass, index) {
            const input = document.getElementById('hire-type');
            const selectedText = document.getElementById('hire-type-selected-text');
            const selectedIcon = document.getElementById('hire-type-selected-icon');
            if (input) input.value = value;
            if (selectedText) selectedText.textContent = value;
            if (selectedIcon && iconClass) selectedIcon.className = `${iconClass} shrink-0`;

            const options = document.querySelectorAll('.hire-option');
            options.forEach((opt, idx) => {
                const optVal = opt.getAttribute('data-value') || '';
                const check = opt.querySelector('i.fa-check');
                const isMatch = optVal === value;
                opt.setAttribute('aria-selected', isMatch ? 'true' : 'false');
                if (isMatch) {
                    hireActiveOptionIndex = idx;
                    opt.classList.remove('text-gray-300');
                    opt.classList.add('text-cyan', 'bg-cyan/10');
                    if (check) {
                        check.classList.remove('opacity-0');
                        check.classList.add('opacity-100');
                    }
                } else {
                    opt.classList.remove('text-cyan', 'bg-cyan/10');
                    opt.classList.add('text-gray-300');
                    if (check) {
                        check.classList.remove('opacity-100');
                        check.classList.add('opacity-0');
                    }
                }
            });

            window.toggleHireDropdown(null, false);
            const btn = document.getElementById('hire-type-btn');
            if (btn) btn.focus();
        };

        window.handleHireDropdownKey = function (e) {
            const menu = document.getElementById('hire-type-menu');
            const isMenuOpen = menu && !menu.classList.contains('hidden');
            const options = document.querySelectorAll('.hire-option');
            if (options.length === 0) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (!isMenuOpen) {
                        window.toggleHireDropdown(null, true);
                    } else {
                        updateActiveDropdownOption((hireActiveOptionIndex + 1) % options.length);
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (!isMenuOpen) {
                        window.toggleHireDropdown(null, true);
                    } else {
                        updateActiveDropdownOption((hireActiveOptionIndex - 1 + options.length) % options.length);
                    }
                    break;
                case 'Home':
                    if (isMenuOpen) {
                        e.preventDefault();
                        updateActiveDropdownOption(0);
                    }
                    break;
                case 'End':
                    if (isMenuOpen) {
                        e.preventDefault();
                        updateActiveDropdownOption(options.length - 1);
                    }
                    break;
                case 'Enter':
                case ' ':
                    if (isMenuOpen) {
                        e.preventDefault();
                        const activeOpt = options[hireActiveOptionIndex];
                        if (activeOpt) {
                            const val = activeOpt.getAttribute('data-value');
                            const icon = activeOpt.getAttribute('data-icon');
                            selectHireOption(val, icon, hireActiveOptionIndex);
                        }
                    } else {
                        e.preventDefault();
                        window.toggleHireDropdown(null, true);
                    }
                    break;
                case 'Escape':
                    if (isMenuOpen) {
                        e.preventDefault();
                        e.stopPropagation();
                        window.toggleHireDropdown(null, false);
                        const btn = document.getElementById('hire-type-btn');
                        if (btn) btn.focus();
                    }
                    break;
                case 'Tab':
                    if (isMenuOpen) {
                        window.toggleHireDropdown(null, false);
                    }
                    break;
            }
        };

        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('hire-type-dropdown');
            const menu = document.getElementById('hire-type-menu');
            if (menu && !menu.classList.contains('hidden')) {
                if (!dropdown || !dropdown.contains(e.target)) {
                    menu.classList.add('hidden');
                    menu.classList.remove('flex');
                    const chevron = document.getElementById('hire-type-chevron');
                    if (chevron) chevron.classList.remove('rotate-180');
                    const btn = document.getElementById('hire-type-btn');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                }
            }
        });

        window.handleHireSubmit = async function (e) {
            e.preventDefault();
            const form = document.getElementById('hire-contact-form');
            const submitBtn = document.getElementById('hire-submit-btn');
            const btnText = document.getElementById('hire-btn-text');
            const btnIcon = document.getElementById('hire-btn-icon');
            const alertBox = document.getElementById('hire-form-alert');
            const successView = document.getElementById('hire-success-view');

            const showAlert = (msg, isError = true, isHtml = false) => {
                if (!alertBox) return;
                if (isHtml) {
                    alertBox.innerHTML = msg;
                } else {
                    alertBox.textContent = msg;
                }
                alertBox.className = isError
                    ? 'rounded-xl p-3 text-xs sm:text-sm font-mono border border-red-500/40 bg-red-950/40 text-red-200 block transition-all duration-200'
                    : 'rounded-xl p-3 text-xs sm:text-sm font-mono border border-cyan/40 bg-cyan-950/40 text-cyan-200 block transition-all duration-200';
            };

            const hideAlert = () => {
                if (!alertBox) return;
                alertBox.className = 'hidden';
                alertBox.textContent = '';
                alertBox.innerHTML = '';
            };

            hideAlert();

            // Silent Honeypot check (catches automated scanners transparently)
            const honey1 = (document.getElementById('hire-fax-hp')?.value || '').trim();
            const honey2 = (document.getElementById('hire-website-hp')?.value || '').trim();
            if (honey1 || honey2) {
                form.classList.add('hidden');
                successView.classList.remove('hidden');
                return;
            }

            // Validate fields
            const name = (document.getElementById('hire-name')?.value || '').trim();
            const email = (document.getElementById('hire-email')?.value || '').trim();
            const organization = (document.getElementById('hire-org')?.value || '').trim();
            const inquiryType = (document.getElementById('hire-type')?.value || '').trim();
            const subject = (document.getElementById('hire-subject')?.value || '').trim();
            const message = (document.getElementById('hire-message')?.value || '').trim();

            if (!name || !email || !subject || !message) {
                showAlert('Please fill in all required fields (Name, Email, Subject, Message).');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert('Please enter a valid email address.');
                return;
            }

            const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${inquiryType}: ${subject} (from ${name})`);
            const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nOrganization: ${organization || 'Not specified'}\nInquiry Type: ${inquiryType}\n\nMessage:\n${message}`);
            const mailtoUrl = `mailto:wwang3@fandm.edu?cc=wangweifeng0316@gmail.com&subject=${mailtoSubject}&body=${mailtoBody}`;

            submitBtn.disabled = true;
            if (btnText) btnText.textContent = 'Sending...';
            if (btnIcon) btnIcon.className = 'fa-solid fa-circle-notch fa-spin text-xs';

            const payload = {
                name: name,
                email: email,
                organization: organization || 'Not specified',
                inquiry_type: inquiryType,
                subject: subject,
                message: message,
                _replyto: email,
                _cc: 'wangweifeng0316@gmail.com',
                _subject: `[Portfolio Inquiry] ${inquiryType}: ${subject} (from ${name})`,
                _template: 'table',
                _captcha: 'false',
                _blacklist: 'crypto, viagra, casino, loan, seo backlinks, telegram'
            };

            try {
                const response = await fetch('https://formsubmit.co/ajax/843abd1b04fdafc22b85114d09493286', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json().catch(() => null);

                if (response.ok && (!data || data.success === 'true' || data.success === true || response.status === 200)) {
                    form.reset();
                    form.classList.add('hidden');
                    successView.classList.remove('hidden');
                    successView.classList.add('flex');
                } else if (data && data.message && data.message.includes('Activation')) {
                    showAlert('FormSubmit activation email sent! Please check your email inbox and click "Activate Form" once to complete setup.', false);
                } else {
                    const errMsg = (data && data.message) ? data.message : 'Unable to send right now.';
                    showAlert(`<div>${errMsg}</div><div class="mt-2"><a href="${mailtoUrl}" class="text-cyan underline font-bold">Click here to send via Email App ↗</a></div>`, true, true);
                }
            } catch (err) {
                const isLocalFile = window.location.protocol === 'file:';
                const tip = isLocalFile
                    ? 'FormSubmit requires a web server (e.g. GitHub Pages or http://localhost) and cannot receive submissions directly from a local file:// path.'
                    : 'Network connection issue with FormSubmit service.';
                showAlert(`<div class="space-y-1.5"><div>${tip}</div><div><a href="${mailtoUrl}" class="inline-flex items-center gap-1.5 text-cyan hover:underline font-bold"><span>Open directly in Email Client (mailto) ↗</span></a></div></div>`, true, true);
            } finally {
                submitBtn.disabled = false;
                if (btnText) btnText.textContent = 'Send Message';
                if (btnIcon) btnIcon.className = 'fa-solid fa-paper-plane text-xs';
            }
        };

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const dropdownMenu = document.getElementById('hire-type-menu');
                if (dropdownMenu && !dropdownMenu.classList.contains('hidden')) {
                    toggleHireDropdown();
                    return;
                }
                const lightbox = document.getElementById('image-lightbox');
                if (lightbox && !lightbox.classList.contains('hidden')) {
                    closeLightbox();
                }
                const usphdModal = document.getElementById('usphd-modal');
                if (usphdModal && !usphdModal.classList.contains('hidden')) {
                    closeUsphdModal();
                    return;
                }
                const modal = document.getElementById('warning-modal');
                if (modal && !modal.classList.contains('hidden')) {
                    closeWarningModal();
                }
                const hireModal = document.getElementById('hire-modal');
                if (hireModal && !hireModal.classList.contains('hidden')) {
                    closeHireModal();
                }
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('opacity-0')) {
                    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
                    if (mobileMenuBtn) mobileMenuBtn.click();
                }
            } else if (e.key === 'Enter' || e.key === ' ') {
                const target = e.target;
                if (target && target.getAttribute('role') === 'button' && target.tagName !== 'BUTTON') {
                    e.preventDefault();
                    target.click();
                }
            }
        });

        function initDomFeatures() {


            document.querySelectorAll('i.fa-solid, i.fa-brands, i.fa-regular').forEach(icon => {
                if (!icon.hasAttribute('aria-hidden')) {
                    icon.setAttribute('aria-hidden', 'true');
                }
            });

            document.querySelectorAll('a[target="_blank"]').forEach(a => {
                if (!a.getAttribute('aria-label')) {
                    const label = (a.textContent || '').replace(/\s+/g, ' ').trim();
                    if (label) {
                        a.setAttribute('aria-label', `${label} (opens in a new tab)`);
                    }
                }
            });

            const announcePage = (pageName) => {
                const announcer = document.getElementById('a11y-announcer');
                if (announcer) {
                    announcer.textContent = `${pageName} section loaded`;
                }
            };

            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            document.querySelectorAll('.auto-year').forEach(el => el.textContent = currentYear);
            document.querySelectorAll('.auto-date').forEach(el => el.textContent = currentMonthYear);

            const navLinks = document.querySelectorAll('.nav-link, .nav-brand');
            const pages = document.querySelectorAll('.page');
            const mainContainer = document.getElementById('main-container');
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            let isMobileMenuOpen = false;

            const toggleMobileMenu = () => {
                isMobileMenuOpen = !isMobileMenuOpen;
                if (mobileMenuBtn) {
                    mobileMenuBtn.setAttribute('aria-expanded', isMobileMenuOpen ? 'true' : 'false');
                }
                if (mobileMenu) {
                    mobileMenu.setAttribute('aria-hidden', isMobileMenuOpen ? 'false' : 'true');
                }
                if (isMobileMenuOpen) {
                    mobileMenu.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
                    mobileMenu.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
                    mobileMenuBtn.innerHTML = '<i class="fa-solid fa-xmark text-sm" aria-hidden="true"></i>';
                } else {
                    mobileMenu.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
                    mobileMenu.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
                    mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars text-sm" aria-hidden="true"></i>';
                }
            };

            if (mobileMenuBtn) {
                mobileMenuBtn.addEventListener('click', toggleMobileMenu);
            }

            const pageTitleMap = {
                'me': 'Me',
                'hybrid-skillset': 'Hybrid Skillset',
                'experiences': 'Experiences',
                'outputs-awards': 'Outputs & Awards',
                'facts': 'Facts',
                'about-website': 'Furthermore'
            };

            navLinks.forEach(link => {
                link.addEventListener('click', () => {

                    const targetId = link.getAttribute('data-target');
                    mainContainer.scrollTop = 0;

                    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
                    document.querySelectorAll(`.nav-link[data-target="${targetId}"]`).forEach(n => n.classList.add('active'));

                    document.querySelectorAll('.nav-link[role="tab"]').forEach(tab => {
                        const isSelected = tab.getAttribute('data-target') === targetId;
                        tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
                        tab.setAttribute('tabindex', isSelected ? '0' : '-1');
                    });

                    pages.forEach(p => {
                        p.classList.remove('active');
                        p.setAttribute('aria-hidden', 'true');
                        p.setAttribute('inert', '');
                    });

                    const targetPage = document.getElementById('page-' + targetId)
                        || (targetId === 'home' || targetId === 'profile' ? document.getElementById('page-me') : null)
                        || (targetId === 'core' ? document.getElementById('page-hybrid-skillset') : null)
                        || (targetId === 'labor' || targetId === 'experience' ? document.getElementById('page-experiences') : null)
                        || (targetId === 'synapses' || targetId === 'outputs' || targetId === 'awards' ? document.getElementById('page-outputs-awards') : null)
                        || (targetId === 'facts' || targetId === 'arsenal' ? document.getElementById('page-facts') : null)
                        || (targetId === 'about-website' || targetId === 'about' || targetId === 'carbon' || targetId === 'website' ? document.getElementById('page-about-website') : null);
                    if (targetPage) {
                        setTimeout(() => {
                            targetPage.classList.add('active');
                            targetPage.removeAttribute('aria-hidden');
                            targetPage.removeAttribute('inert');
                            targetPage.scrollTop = 0;
                        }, 50);
                    }

                    announcePage(pageTitleMap[targetId] || targetId);

                    if (isMobileMenuOpen && link.classList.contains('mobile-nav-link')) {
                        toggleMobileMenu();
                    }
                });
            });

            const tablist = document.querySelector('[role="tablist"]');
            if (tablist) {
                const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
                tablist.addEventListener('keydown', (e) => {
                    const currentIndex = tabs.indexOf(document.activeElement);
                    if (currentIndex === -1) return;

                    let nextIndex = currentIndex;
                    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                        e.preventDefault();
                        nextIndex = (currentIndex + 1) % tabs.length;
                    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                        e.preventDefault();
                        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                    } else if (e.key === 'Home') {
                        e.preventDefault();
                        nextIndex = 0;
                    } else if (e.key === 'End') {
                        e.preventDefault();
                        nextIndex = tabs.length - 1;
                    }

                    if (nextIndex !== currentIndex) {
                        tabs[nextIndex].focus();
                        tabs[nextIndex].click();
                    }
                });
            }

            // -------------------------------------------------------------
            // Playground Not For Kids / Portfolio Lab Engine
            // -------------------------------------------------------------
            const portfolioLabItems = [
                { title: 'MeowOJ Platform', tag: 'Project / Systems', summary: 'Gamified online judge with sandboxed code evaluation, algorithmic verification, and live leaderboards.', target: 'outputs-awards' },
                { title: 'Dengue Fever ML', tag: 'Research / ML', summary: 'Predictive statistical modeling and machine learning applied to open public-health epidemiology datasets.', target: 'outputs-awards' },
                { title: 'Certiferox', tag: 'Product / AI', summary: 'Decentralized verifiable credentials and applied AI identity verification prototype.', target: 'outputs-awards' },
                { title: 'CHC Hardware Club', tag: 'Hardware / Community', summary: 'Founded a campus DIY hardware collective with hands-on soldering workshops and open build documentation.', target: 'experiences' },
                { title: 'AMC 12 Honor Roll', tag: 'Award / Mathematics', summary: 'Earned the Honor Roll of Distinction in the 2023 American Mathematics Competition 12.', target: 'outputs-awards' },
                { title: 'OUCC National High Distinction', tag: 'Award / Algorithms', summary: 'China National High Distinction in the Senior division of the Oxford University Computing Challenge.', target: 'outputs-awards' },
                { title: 'CCC Global Top 4%', tag: 'Award / Informatics', summary: '2024 CCC Computing Junior Division (Score 71/75 · Honor Roll), ranking in the global top 4%.', target: 'outputs-awards' },
                { title: 'Moonshot & GaiaNet Hackathon Win', tag: 'Award / Hackathon', summary: 'Won Second Prize (Moonshot track) and First Prize (GaiaNet track) for applied decentralized AI systems.', target: 'outputs-awards' },
                { title: '"FLOUR" Short Film', tag: 'Cinema / Visual Design', summary: 'Won Best Cinematography & Visual Design at the Annual High School Film Festival.', target: 'outputs-awards' },
                { title: 'USAP Pentathlon Top Scorer', tag: 'Award / Academic', summary: 'Highest overall score and top individual scorer in the United States Academic Pentathlon.', target: 'outputs-awards' },
                { title: '0.013g CO2 Stealth Engine', tag: 'Trivia / Architecture', summary: 'Architected this site to emit only 0.013g CO2 per cold load — graded A+ on sustainable web audits with zero tracking.', target: 'about-website' },
                { title: 'CPS112 CS2 Lab Assistant', tag: 'Leadership / Teaching', summary: 'Mentoring peers through advanced data structures, algorithmic edge cases, and memory debugging sessions.', target: 'experiences' },
                { title: 'Parody University Lore', tag: 'Story / Satire', summary: 'Founded a parody higher-education institution designed for self-reliant, humor-loving student builders.', target: 'experiences' },
                { title: 'Film Cosplay Showcase', tag: 'Trivia / Fun', summary: 'Once presented an entire film festival award ceremony in full cosplay costume without breaking character.', target: 'outputs-awards' },
                { title: 'Debate × CS Portal', tag: 'Project / Community', summary: 'Engineered an interactive debate pairing and adjudication portal for campus competitive speech.', target: 'outputs-awards' },
                { title: '"Road to ACE" Series', tag: 'Output / Education', summary: 'Authored an open curriculum demystifying competitive algorithms and olympiad informatics.', target: 'outputs-awards' }
            ];

            const portfolioLabJokes = [
                "Why did the toilet paper roll down the hill? To get to the bottom.",
                "What did the left butt cheek say to the right? Between you and me, something smells crazy.",
                "Why are farts like software bugs? Because you hope they're silent, but everyone knows you authored the commit.",
                "What did one toilet say to the other? 'You look flushed. Did somebody drop something heavy?'",
                "Did you hear about the constipated mathematician? He sat down and worked it out with a pencil.",
                "What did the poop say to the fart? 'You blow me away!'",
                "Software and diarrhea have one thing in common: Once they start running, you pray the cloud backup holds.",
                "Why was the belt arrested in the restroom? For holding up a pair of pants without consent!",
                "What do you call a dinosaur with extreme gastric issues? An Explod-o-saurus.",
                "My server doesn't have memory leaks. It just had spicy midnight street food and needs a forced purge.",
                "What happens when you flush a clock down the toilet? You waste a lot of time.",
                "Why did the skeleton go into the restroom alone? Because he had no-body to go with.",
                "Why did the toilet paper fail its driving test? It couldn't stop leaving skid marks.",
                "What do you call a magical fairy hovering over the toilet? Stinker Bell.",
                "Life is like a roll of toilet paper: It seems endless at first, but once you hit the cardboard core, things get desperate fast.",
                "What is a ninja's favorite kind of fart? Silent but deadly.",
                "Why don't toilets ever get lonely? Because good friends are always dropping by.",
                "What happens when you ingest 1,000,000 bytes of bad data? A complete core dump in the ceramic terminal.",
                "What did the spider in the toilet say? 'Don't flush, I'm just here for the web development!'",
                "There are two types of people in this world: Those who look before flushing, and liars.",
                "Why is poop always so polite? Because it always introduces itself before it steps out.",
                "What do you call a magical poop? A poof!",
                "Why do people love reading on the toilet? Because it's a great place to digest information.",
                "Why don't farts ever go to school? Because they always get expelled.",
                "What do you call a fart that doesn't make a sound? A ghost toot.",
                "Love is like a fart: If you have to force it, it's probably shit.",
                "A fart is just the desperate cry of an imprisoned poop.",
                "Why did the poop go to therapy? It had too much built-up emotional baggage and needed a clean release.",
                "What did the plumber say to the clogged toilet? 'I've seen some shit in my life, but this is legendary.'",
                "What's the similarity between dropped Wi-Fi and diarrhea? When either goes down unexpectedly, immediate panic ensues.",
                "What do you call someone who spends 45 minutes on the porcelain throne? A smartphone enthusiast doing peer review."
            ];

            const portfolioLabJokeIntros = [
                "Here is a good one...",
                "Wait, hear this out...",
                "Certified knee-slapper incoming...",
                "You didn't ask for this, but...",
                "Hot off the porcelain press...",
                "Warning: dangerously low temperature...",
                "Fresh dispatch from the comedy cellar...",
                "Don't blame me, blame the algorithm...",
                "Hold onto your seat...",
                "One fresh cold joke, coming right up..."
            ];

            const labResult = document.getElementById('portfolio-lab-result');
            let isLabTransitioning = false;
            const renderLabResult = (eyebrow, title, body, actionLabel, targetId, mode = 'item') => {
                if (!labResult || isLabTransitioning) return;
                isLabTransitioning = true;

                // 1. Smoothly lift, scale down, and blur away
                labResult.style.transition = 'opacity 0.14s ease-in, transform 0.14s cubic-bezier(0.4, 0, 1, 1), filter 0.14s ease-in';
                labResult.style.opacity = '0';
                labResult.style.transform = 'translateY(-8px) scale(0.985)';
                labResult.style.filter = 'blur(4px)';

                setTimeout(() => {
                    const titleMarkup = title ? (mode === 'joke'
                        ? `<h4 class="font-display text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-acid via-cyan to-neo inline-block mb-2">${title}</h4>`
                        : `<h4 class="font-display text-2xl sm:text-3xl font-bold inline-block mb-2" style="background: linear-gradient(135deg, #34d399, #00f0ff, #f8d8ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${title}</h4>`
                    ) : '';

                    labResult.innerHTML = `
                        ${eyebrow ? `<p class="font-mono text-xs uppercase tracking-wider text-cyan mb-2">${eyebrow}</p>` : ''}
                        ${titleMarkup}
                        <div class="text-xs sm:text-sm text-gray-300 font-light leading-relaxed max-w-3xl">${body}</div>
                        ${targetId ? `<div class="mt-4"><button type="button" data-lab-target="${targetId}" class="inline-flex items-center gap-2 font-mono text-xs text-acid hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan w-max"><span>${actionLabel}</span><i class="fa-solid fa-arrow-right text-xs" aria-hidden="true"></i></button></div>` : ''}
                    `;

                    // 2. Set entrance starting position without animation
                    labResult.style.transition = 'none';
                    labResult.style.opacity = '0';
                    labResult.style.transform = 'translateY(12px) scale(0.985)';
                    labResult.style.filter = 'blur(4px)';
                    void labResult.offsetWidth; // Force layout reflow

                    // 3. Silky spring-like deceleration entrance with responsive neon glow feedback
                    labResult.style.transition = 'opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1), transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), filter 0.32s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.45s ease, box-shadow 0.45s ease';
                    labResult.style.opacity = '1';
                    labResult.style.transform = 'translateY(0) scale(1)';
                    labResult.style.filter = 'blur(0)';

                    if (mode === 'joke') {
                        labResult.style.borderColor = 'rgba(212, 255, 0, 0.35)';
                        labResult.style.boxShadow = '0 0 35px -5px rgba(212, 255, 0, 0.18)';
                    } else {
                        labResult.style.borderColor = 'rgba(0, 240, 255, 0.35)';
                        labResult.style.boxShadow = '0 0 35px -5px rgba(0, 240, 255, 0.18)';
                    }

                    setTimeout(() => {
                        labResult.style.borderColor = '';
                        labResult.style.boxShadow = '';
                        isLabTransitioning = false;
                    }, 400);
                }, 140);
            };

            let lastRandomItemIndex = -1;
            const drawRandomAnything = () => {
                let itemIndex = Math.floor(Math.random() * portfolioLabItems.length);
                if (portfolioLabItems.length > 1 && itemIndex === lastRandomItemIndex) {
                    itemIndex = (itemIndex + 1) % portfolioLabItems.length;
                }
                lastRandomItemIndex = itemIndex;
                const item = portfolioLabItems[itemIndex];
                renderLabResult(item.tag, item.title, item.summary, 'Explore in context', item.target, 'item');
            };

            let lastJokeIntroIndex = -1;
            let lastJokeIndex = -1;
            const drawJoke = () => {
                let introIndex = Math.floor(Math.random() * portfolioLabJokeIntros.length);
                if (portfolioLabJokeIntros.length > 1 && introIndex === lastJokeIntroIndex) {
                    introIndex = (introIndex + 1) % portfolioLabJokeIntros.length;
                }
                lastJokeIntroIndex = introIndex;

                let jokeIndex = Math.floor(Math.random() * portfolioLabJokes.length);
                if (portfolioLabJokes.length > 1 && jokeIndex === lastJokeIndex) {
                    jokeIndex = (jokeIndex + 1) % portfolioLabJokes.length;
                }
                lastJokeIndex = jokeIndex;

                const intro = portfolioLabJokeIntros[introIndex];
                const joke = portfolioLabJokes[jokeIndex];
                renderLabResult(
                    '',
                    intro,
                    `<p class="text-white text-base sm:text-lg font-normal leading-relaxed">“${joke}”</p>`,
                    '',
                    '',
                    'joke'
                );
            };

            document.getElementById('portfolio-lab-project')?.addEventListener('click', drawRandomAnything);
            document.getElementById('portfolio-lab-principle')?.addEventListener('click', drawJoke);
            labResult?.addEventListener('click', (event) => {
                const targetButton = event.target.closest('[data-lab-target]');
                if (!targetButton) return;
                const targetLink = document.querySelector(`.nav-link[data-target="${targetButton.dataset.labTarget}"]`);
                targetLink?.click();
            });

            const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            const isPcOrMac = (() => {
                const ua = navigator.userAgent || '';
                const platform = navigator.platform || '';
                const isMobileUa = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(ua);
                const isDesktopOS = /Macintosh|MacIntel|MacPPC|Mac68K|Windows|Win32|Win64|WinCE|Linux x86_64/i.test(ua) || /Win|Mac/i.test(platform);
                return isDesktopOS && !isMobileUa && window.innerWidth >= 768;
            })();

            window.__initThreeWave = function () {
                if (window.__threeInitialized || typeof THREE === 'undefined' || window.__AUDITOR_MODE__) return;
                window.__threeInitialized = true;

                const waveCanvas = document.getElementById('wave-canvas');
                if (!waveCanvas) return;
                const scene = new THREE.Scene();

            scene.fog = new THREE.FogExp2(0x020203, isMobile ? 0.038 : 0.035);

            const camera = new THREE.PerspectiveCamera(isMobile ? 60 : 55, window.innerWidth / window.innerHeight, 0.1, 150);
            camera.position.set(0, 8, 26);
            camera.lookAt(0, -2, 0);

            const renderer = new THREE.WebGLRenderer({
                canvas: waveCanvas,
                alpha: true,
                antialias: !isMobile,
                powerPreference: "high-performance",
                precision: isMobile ? "mediump" : "highp"
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2));

            const texCanvas = document.createElement('canvas');
            texCanvas.width = 64;
            texCanvas.height = 64;
            const texCtx = texCanvas.getContext('2d');

            const grad = texCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
            grad.addColorStop(0, 'rgba(255,255,255,1)');
            grad.addColorStop(0.2, 'rgba(255,255,255,0.8)');
            grad.addColorStop(0.5, 'rgba(255,255,255,0.2)');
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            texCtx.fillStyle = grad;
            texCtx.fillRect(0, 0, 64, 64);

            texCtx.strokeStyle = '#ffffff';
            texCtx.lineWidth = 2;
            texCtx.lineCap = 'round';
            texCtx.shadowBlur = 8;
            texCtx.shadowColor = '#ffffff';
            texCtx.beginPath();
            texCtx.moveTo(32, 8); texCtx.lineTo(32, 56);
            texCtx.moveTo(8, 32); texCtx.lineTo(56, 32);
            texCtx.stroke();
            const particleTexture = new THREE.CanvasTexture(texCanvas);

            const particleCount = isMobile ? 16000 : 45000;
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const sizes = new Float32Array(particleCount);
            const phases = new Float32Array(particleCount);

            for (let i = 0; i < particleCount; i++) {
                const radius = 65 * Math.sqrt(Math.random());
                const theta = Math.random() * 2 * Math.PI;
                const px = radius * Math.cos(theta);
                const pz = radius * Math.sin(theta) * 0.55;

                positions[i * 3] = px;
                positions[i * 3 + 1] = 0;
                positions[i * 3 + 2] = pz;

                sizes[i] = Math.random() * (isMobile ? 3.0 : 3.5) + 0.6;
                phases[i] = Math.random() * Math.PI * 2;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
            geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uTexture: { value: particleTexture },
                    uCardHover: { value: 0.0 },
                    uCardCenter: { value: new THREE.Vector2(0, 0) },
                    uCardHalfSize: { value: new THREE.Vector2(0.5, 0.5) },
                    uCardRadius: { value: 0.03 },
                    uMouseNdc: { value: new THREE.Vector2(0, 0) },
                    uAspect: { value: window.innerWidth / window.innerHeight }
                },
                vertexShader: `
                    uniform float uTime;
                    uniform float uCardHover;
                    uniform vec2 uCardCenter;
                    uniform vec2 uCardHalfSize;
                    uniform float uCardRadius;
                    uniform vec2 uMouseNdc;
                    uniform float uAspect;

                    attribute float aSize;
                    attribute float aPhase;
                    varying vec3 vColor;
                    varying float vFrostedRefract;
                    
                    void main() {
                        vec3 pos = position;
                        float t = uTime * 1.2;
                        
                        float wave1 = sin(pos.x * 0.15 + t) * 1.2;
                        float wave2 = cos(pos.z * 0.1 + t * 0.8) * 1.5;
                        float wave3 = sin((pos.x + pos.z) * 0.08 - t * 0.6) * 0.8;
                        float wave4 = cos((pos.x - pos.z) * 0.2 + t * 1.2) * 0.4;
                        float h = wave1 + wave2 + wave3 + wave4;
                        
                        vec4 baseMv = modelViewMatrix * vec4(pos, 1.0);
                        vec4 baseClip = projectionMatrix * baseMv;
                        vec2 ndc = baseClip.xy / baseClip.w;

                        float influence = 0.0;
                        float distToBox = 1.0;
                        vec2 q = vec2(1.0, 1.0);
                        vec2 offset = vec2(0.0, 0.0);

                        if (uCardHover > 0.001) {
                            offset = ndc - uCardCenter;
                            vec2 pAspect = vec2(offset.x * uAspect, offset.y);
                            vec2 sizeAspect = vec2(uCardHalfSize.x * uAspect, uCardHalfSize.y);

                            float r = clamp(uCardRadius, 0.0, min(sizeAspect.x, sizeAspect.y) * 0.45);
                            q = abs(pAspect) - (sizeAspect - vec2(r, r));
                            distToBox = length(max(q, vec2(0.0, 0.0))) + min(max(q.x, q.y), 0.0) - r;

                            influence = smoothstep(0.18, -0.04, distToBox) * uCardHover;
                        }

                        float calmFactor = 1.0 - influence * 0.88;
                        float jitter = sin(t * 3.0 + aPhase) * 0.25 * calmFactor;
                        float baseY = h * (1.0 - influence * 0.35) + jitter;

                        pos.y = baseY;
                        pos.x -= cos(pos.x * 0.15 + t) * (0.35 * calmFactor) * h;
                        pos.z -= sin(pos.z * 0.1 + t * 0.8) * (0.35 * calmFactor) * h;

                        float edgeRidge = 0.0;
                        float alignedWave = 0.0;
                        float depthLift = 0.0;

                        if (influence > 0.001) {
                            vec2 safeHalf = max(uCardHalfSize, vec2(0.001, 0.001));
                            vec2 cardNorm = clamp(offset / safeHalf, vec2(-1.5, -1.5), vec2(1.5, 1.5));

                            float harmonicX = cos(cardNorm.x * 3.14159265 * 2.0 + t * 0.25);
                            float harmonicY = cos(cardNorm.y * 3.14159265 * 1.6 - t * 0.20);
                            alignedWave = (harmonicX * 0.5 + harmonicY * 0.5) * 0.35;

                            edgeRidge = exp(-pow(distToBox / 0.045, 2.0));

                            float insideMask = 1.0 - smoothstep(-0.15, 0.06, distToBox);
                            depthLift = (insideMask * 0.35 + edgeRidge * 0.25) * influence;

                            pos.y = mix(baseY, baseY * 0.45 + alignedWave, influence * 0.65);
                            pos.y += depthLift;

                            if (abs(distToBox) < 0.035) {
                                vec2 qMax = max(q, vec2(0.0, 0.0));
                                vec2 grad = normalize(qMax + vec2(step(q.y, q.x), step(q.x, q.y)) * min(max(q.x, q.y), 0.0) + vec2(0.0001, 0.0001));
                                float pull = -distToBox * 0.06 * exp(-pow(distToBox / 0.04, 2.0));
                                pos.x += grad.x * pull * 0.5 * influence;
                                pos.z += grad.y * pull * 0.5 * influence;
                            }
                        }

                        float hue = fract(pos.x * 0.015 + pos.z * 0.015 + t * 0.1);
                        vec3 c1 = vec3(0.875, 1.0, 0.0);
                        vec3 c2 = vec3(0.0, 0.941, 1.0);
                        vec3 c3 = vec3(0.439, 0.0, 1.0);
                        
                        vec3 rainbow;
                        float h_val = hue * 3.0;
                        if (h_val < 1.0) {
                            rainbow = mix(c1, c2, h_val);
                        } else if (h_val < 2.0) {
                            rainbow = mix(c2, c3, h_val - 1.0);
                        } else {
                            rainbow = mix(c3, c1, h_val - 2.0);
                        }
                        
                        float baseLightness = clamp(0.18 + (pos.y + 3.0) / 9.0, 0.08, 0.92);
                        
                        vColor = rainbow * baseLightness;
                        vFrostedRefract = influence;
                        
                        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                        mvPosition.z += depthLift * 0.15;

                        gl_PointSize = aSize * (50.0 / -mvPosition.z);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    uniform sampler2D uTexture;
                    varying vec3 vColor;
                    varying float vFrostedRefract;
                    
                    void main() {
                        vec4 texColor = texture2D(uTexture, gl_PointCoord);
                        float alpha = texColor.a * (0.9 + vFrostedRefract * 0.1);
                        gl_FragColor = vec4(vColor * texColor.rgb, alpha);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const mesh = new THREE.Points(geometry, material);
            mesh.position.y = -6;
            scene.add(mesh);

            let activeHoveredCard = null;
            let targetHover = 0.0;
            let currentHover = 0.0;
            const targetCenter = new THREE.Vector2(0, 0);
            const currentCenter = new THREE.Vector2(0, 0);
            const targetHalfSize = new THREE.Vector2(0.5, 0.5);
            const currentHalfSize = new THREE.Vector2(0.5, 0.5);
            let targetRadius = 0.03;
            let currentRadius = 0.03;
            const targetMouseNdc = new THREE.Vector2(0, 0);
            const currentMouseNdc = new THREE.Vector2(0, 0);
            let lastPointerX = -1;
            let lastPointerY = -1;

            const getGlassCard = (element) => {
                if (!element) return null;
                let card = element.closest('.glass-panel');
                if (!card) return null;
                const parentCard = card.parentElement ? card.parentElement.closest('.glass-panel') : null;
                if (parentCard && (card.offsetWidth < 140 || card.offsetHeight < 48)) {
                    card = parentCard;
                }
                return card;
            };

            const updateCardBounds = () => {
                if (!activeHoveredCard) return;
                if (!activeHoveredCard.isConnected || activeHoveredCard.offsetParent === null) {
                    activeHoveredCard = null;
                    targetHover = 0.0;
                    return;
                }
                const rect = activeHoveredCard.getBoundingClientRect();
                const w = window.innerWidth;
                const h = window.innerHeight;

                if (rect.bottom < -30 || rect.top > h + 30 || rect.right < -30 || rect.left > w + 30) {
                    targetHover = 0.0;
                    return;
                }

                targetHover = 1.0;
                const minX = (rect.left / w) * 2.0 - 1.0;
                const maxX = (rect.right / w) * 2.0 - 1.0;
                const minY = 1.0 - (rect.bottom / h) * 2.0;
                const maxY = 1.0 - (rect.top / h) * 2.0;

                targetCenter.set((minX + maxX) * 0.5, (minY + maxY) * 0.5);
                targetHalfSize.set(Math.max(0.001, (maxX - minX) * 0.5), Math.max(0.001, (maxY - minY) * 0.5));

                let rPx = 28;
                try {
                    const style = window.getComputedStyle(activeHoveredCard);
                    const cr = parseFloat(style.borderTopLeftRadius);
                    if (!isNaN(cr) && cr > 0) rPx = cr;
                } catch (e) {}
                targetRadius = (rPx / h) * 2.0;
            };

            const onPointerMove = (e) => {
                if (!isPcOrMac) return;
                const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : lastPointerX);
                const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : lastPointerY);
                if (clientX === undefined || clientY === undefined || clientX < 0 || clientY < 0) return;
                lastPointerX = clientX;
                lastPointerY = clientY;

                const w = window.innerWidth;
                const h = window.innerHeight;
                targetMouseNdc.set((clientX / w) * 2.0 - 1.0, 1.0 - (clientY / h) * 2.0);

                const element = document.elementFromPoint(clientX, clientY);
                const card = getGlassCard(element);

                if (card) {
                    activeHoveredCard = card;
                    updateCardBounds();
                } else {
                    activeHoveredCard = null;
                    targetHover = 0.0;
                }
            };

            window.addEventListener('pointermove', onPointerMove, { passive: true });
            window.addEventListener('pointerdown', onPointerMove, { passive: true });
            document.addEventListener('mouseleave', () => {
                activeHoveredCard = null;
                targetHover = 0.0;
            });

            const initTiltCards = () => {
                const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                if (!isFinePointer || prefersReducedMotion) return;

                const isGlassCard = (el) => {
                    if (!el || !(el instanceof HTMLElement)) return false;
                    const tag = el.tagName.toLowerCase();
                    if (tag === 'nav' || tag === 'button' || tag === 'span' || tag === 'p') return false;
                    if (el.closest('nav') || el.id === 'mobile-menu' || el.closest('#mobile-menu')) return false;
                    if (el.closest('#image-lightbox-modal') || el.closest('#warning-modal') || el.id === 'portfolio-lab' || el.closest('#portfolio-lab')) return false;

                    const cls = el.className || '';
                    if (typeof cls !== 'string' || !cls.includes('glass-panel')) return false;

                    if (/\b(w-7|w-8|w-9|w-11|w-16)\b/.test(cls) && /\b(rounded-full|rounded-xl|rounded-2xl)\b/.test(cls)) {
                        return false;
                    }
                    if (cls.includes('text-[10px]') || (cls.includes('px-2') && cls.includes('py-0.5'))) {
                        return false;
                    }
                    if (tag === 'a' && (cls.includes('px-2') || cls.includes('px-4') || cls.includes('w-8'))) {
                        return false;
                    }

                    return true;
                };

                const allPanels = Array.from(document.querySelectorAll('.glass-panel, .tilt-card'));
                const cards = Array.from(new Set(allPanels.filter(isGlassCard)));

                const cardStates = new Map();
                let isLoopRunning = false;
                let lastTime = performance.now();

                const maxTilt = 1.0;

                cards.forEach((card) => {
                    card.classList.add('tilt-card');

                    if (!card.querySelector('.tilt-specular-container')) {
                        const specular = document.createElement('div');
                        specular.className = 'tilt-specular-container';
                        specular.setAttribute('aria-hidden', 'true');
                        specular.innerHTML = `
                            <div class="tilt-specular-surface"></div>
                            <div class="tilt-specular-border"></div>
                        `;
                        card.appendChild(specular);
                    }

                    const state = {
                        card,
                        currentTiltX: 0,
                        currentTiltY: 0,
                        currentZ: 0,
                        targetTiltX: 0,
                        targetTiltY: 0,
                        targetZ: 0,
                        vx: 0,
                        vy: 0,
                        vz: 0,
                        currentMouseX: 50,
                        currentMouseY: 50,
                        targetMouseX: 50,
                        targetMouseY: 50,
                        isHovered: false,
                        needsUpdate: false
                    };

                    cardStates.set(card, state);

                    const updatePointerTargets = (e) => {
                        e.stopPropagation();
                        const rect = card.getBoundingClientRect();
                        if (rect.width <= 0 || rect.height <= 0) return;
                        const px = e.clientX - rect.left;
                        const py = e.clientY - rect.top;

                        const normX = Math.max(-1, Math.min(1, (px / rect.width) * 2 - 1));
                        const normY = Math.max(-1, Math.min(1, (py / rect.height) * 2 - 1));

                        state.targetTiltX = -normY * maxTilt;
                        state.targetTiltY = normX * maxTilt;
                        state.targetZ = 2.5;

                        state.targetMouseX = (px / rect.width) * 100;
                        state.targetMouseY = (py / rect.height) * 100;

                        state.needsUpdate = true;
                        startLoop();
                    };

                    const onPointerEnter = (e) => {
                        e.stopPropagation();
                        state.isHovered = true;
                        state.needsUpdate = true;
                        card.style.setProperty('--specular-opacity', '1');
                        updatePointerTargets(e);
                    };

                    const onPointerMove = (e) => {
                        e.stopPropagation();
                        if (!state.isHovered) {
                            state.isHovered = true;
                            card.style.setProperty('--specular-opacity', '1');
                        }
                        updatePointerTargets(e);
                    };

                    const onPointerLeave = (e) => {
                        e.stopPropagation();
                        state.isHovered = false;
                        state.targetTiltX = 0;
                        state.targetTiltY = 0;
                        state.targetZ = 0;
                        card.style.setProperty('--specular-opacity', '0');
                        state.needsUpdate = true;
                        startLoop();
                    };

                    card.addEventListener('pointerenter', onPointerEnter, { passive: true });
                    card.addEventListener('pointermove', onPointerMove, { passive: true });
                    card.addEventListener('pointerleave', onPointerLeave, { passive: true });
                });

                const startLoop = () => {
                    if (!isLoopRunning) {
                        isLoopRunning = true;
                        lastTime = performance.now();
                        requestAnimationFrame(tick);
                    }
                };

                const tick = (now) => {
                    const dt = Math.min((now - lastTime) / 1000, 0.05);
                    lastTime = now;

                    let anyActive = false;

                    cardStates.forEach((state) => {
                        if (!state.needsUpdate) return;

                        const k = state.isHovered ? 190 : 155;
                        const c = state.isHovered ? 22 : 13.5;

                        const fx = -k * (state.currentTiltX - state.targetTiltX) - c * state.vx;
                        state.vx += fx * dt;
                        state.currentTiltX += state.vx * dt;

                        const fy = -k * (state.currentTiltY - state.targetTiltY) - c * state.vy;
                        state.vy += fy * dt;
                        state.currentTiltY += state.vy * dt;

                        const kz = state.isHovered ? 160 : 120;
                        const cz = state.isHovered ? 20 : 16;
                        const fz = -kz * (state.currentZ - state.targetZ) - cz * state.vz;
                        state.vz += fz * dt;
                        state.currentZ += state.vz * dt;

                        const specularLerp = Math.min(1.0, dt * 18);
                        state.currentMouseX += (state.targetMouseX - state.currentMouseX) * specularLerp;
                        state.currentMouseY += (state.targetMouseY - state.currentMouseY) * specularLerp;

                        state.card.style.setProperty('--mouse-x', `${state.currentMouseX.toFixed(2)}%`);
                        state.card.style.setProperty('--mouse-y', `${state.currentMouseY.toFixed(2)}%`);

                        state.card.style.transform = `perspective(1000px) rotateX(${state.currentTiltX.toFixed(3)}deg) rotateY(${state.currentTiltY.toFixed(3)}deg) translateZ(${state.currentZ.toFixed(2)}px)`;

                        if (!state.isHovered) {
                            const isFlat = Math.abs(state.currentTiltX) < 0.008 &&
                                           Math.abs(state.currentTiltY) < 0.008 &&
                                           Math.abs(state.currentZ) < 0.02 &&
                                           Math.abs(state.vx) < 0.02 &&
                                           Math.abs(state.vy) < 0.02 &&
                                           Math.abs(state.vz) < 0.02;
                            if (isFlat) {
                                state.currentTiltX = 0;
                                state.currentTiltY = 0;
                                state.currentZ = 0;
                                state.vx = 0;
                                state.vy = 0;
                                state.vz = 0;
                                state.card.style.transform = '';
                                state.needsUpdate = false;
                            } else {
                                anyActive = true;
                            }
                        } else {
                            anyActive = true;
                        }
                    });

                    if (anyActive) {
                        requestAnimationFrame(tick);
                    } else {
                        isLoopRunning = false;
                    }
                };
            };

            initTiltCards();

            const clock = new THREE.Clock();
            let isAnimating = true;
            let lastTime = performance.now();

            const renderFrame = () => {
                const now = performance.now();
                const dt = Math.min((now - lastTime) / 1000, 0.1);
                lastTime = now;

                material.uniforms.uTime.value = clock.getElapsedTime();

                if (isPcOrMac && activeHoveredCard) {
                    updateCardBounds();
                }

                const lerpSpd = Math.min(1.0, dt * 7.5);
                const hoverSpd = Math.min(1.0, dt * 6.0);
                const mouseSpd = Math.min(1.0, dt * 9.0);

                currentHover += (targetHover - currentHover) * hoverSpd;
                currentCenter.lerp(targetCenter, lerpSpd);
                currentHalfSize.lerp(targetHalfSize, lerpSpd);
                currentRadius += (targetRadius - currentRadius) * lerpSpd;
                currentMouseNdc.lerp(targetMouseNdc, mouseSpd);

                material.uniforms.uCardHover.value = currentHover;
                material.uniforms.uCardCenter.value.copy(currentCenter);
                material.uniforms.uCardHalfSize.value.copy(currentHalfSize);
                material.uniforms.uCardRadius.value = currentRadius;
                material.uniforms.uMouseNdc.value.copy(currentMouseNdc);
                material.uniforms.uAspect.value = window.innerWidth / window.innerHeight;

                renderer.render(scene, camera);
            };

            const motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
            let isReducedMotion = motionQuery ? motionQuery.matches : false;

            const animateWave = () => {
                if (isAnimating) {
                    renderFrame();
                    if (!isReducedMotion) {
                        requestAnimationFrame(animateWave);
                    }
                }
            };
            requestAnimationFrame(animateWave);

            if (motionQuery && typeof motionQuery.addEventListener === 'function') {
                motionQuery.addEventListener('change', (e) => {
                    isReducedMotion = e.matches;
                    if (!isReducedMotion && isAnimating) {
                        requestAnimationFrame(animateWave);
                    }
                });
            }

            const onScrollTouch = () => {
                if (isPcOrMac && lastPointerX >= 0 && lastPointerY >= 0) {
                    const element = document.elementFromPoint(lastPointerX, lastPointerY);
                    const card = getGlassCard(element);
                    if (card) {
                        activeHoveredCard = card;
                    } else {
                        activeHoveredCard = null;
                        targetHover = 0.0;
                    }
                    updateCardBounds();
                }
                renderFrame();
            };
            window.addEventListener('scroll', onScrollTouch, { passive: true });
            window.addEventListener('touchmove', onScrollTouch, { passive: true });
            const pageContainer = document.querySelector('.page-container');
            if (pageContainer) {
                pageContainer.addEventListener('scroll', onScrollTouch, { passive: true });
            }

            let lastWidth = window.innerWidth;
            let lastHeight = window.innerHeight;

            window.addEventListener('resize', () => {
                const newWidth = window.innerWidth;
                const newHeight = window.innerHeight;
                if (isMobile && newWidth === lastWidth && Math.abs(newHeight - lastHeight) < 120) {
                    return;
                }
                lastWidth = newWidth;
                lastHeight = newHeight;
                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(newWidth, newHeight);
            });

            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    isAnimating = false;
                } else if (!isAnimating) {
                    isAnimating = true;
                    lastTime = performance.now();
                    clock.start();
                    requestAnimationFrame(animateWave);
                }
            });

                waveCanvas.classList.add('active');
            };

            if (window.__threeScriptLoaded && typeof THREE !== 'undefined' && !window.__AUDITOR_MODE__) {
                window.__initThreeWave();
            }
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initDomFeatures);
        } else {
            initDomFeatures();
        }

        // -------------------------------------------------------------
        // Power-Saving Inactivity Auto-Reload Controller (10-Min Idle)
        // Detects mouse, keyboard, touch, scroll, pointer, and gamepad activity.
        // Reloads the page upon 10 minutes of dormancy to enter cold state and save battery/GPU power.
        // -------------------------------------------------------------
        (function () {
            var IDLE_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
            var lastActivityTime = Date.now();
            var idleCheckTimer = null;
            var gamepadPollTimer = null;
            var previousGamepadState = {};

            function recordActivity() {
                lastActivityTime = Date.now();
            }

            var activityEvents = [
                'mousemove',
                'mousedown',
                'mouseup',
                'click',
                'keydown',
                'keyup',
                'touchstart',
                'touchmove',
                'touchend',
                'pointermove',
                'pointerdown',
                'pointerup',
                'scroll',
                'wheel'
            ];

            var eventOpts = { passive: true, capture: true };
            for (var i = 0; i < activityEvents.length; i++) {
                window.addEventListener(activityEvents[i], recordActivity, eventOpts);
                document.addEventListener(activityEvents[i], recordActivity, eventOpts);
            }

            function pollGamepads() {
                if (!navigator.getGamepads) return;
                var gamepads = navigator.getGamepads();
                if (!gamepads) return;

                var hasConnected = false;
                for (var i = 0; i < gamepads.length; i++) {
                    var gp = gamepads[i];
                    if (!gp) continue;
                    hasConnected = true;

                    var id = gp.index;
                    var prevState = previousGamepadState[id];
                    var currentAxes = gp.axes ? Array.prototype.slice.call(gp.axes) : [];
                    var currentButtons = gp.buttons ? gp.buttons.map(function (b) { return b.pressed || b.value > 0.1; }) : [];

                    if (prevState) {
                        for (var b = 0; b < currentButtons.length; b++) {
                            if (currentButtons[b] && !prevState.buttons[b]) {
                                recordActivity();
                                break;
                            }
                        }
                        for (var a = 0; a < currentAxes.length; a++) {
                            if (prevState.axes[a] !== undefined && Math.abs(currentAxes[a] - prevState.axes[a]) > 0.15) {
                                recordActivity();
                                break;
                            }
                        }
                    }

                    previousGamepadState[id] = {
                        axes: currentAxes,
                        buttons: currentButtons
                    };
                }

                if (!hasConnected && gamepadPollTimer) {
                    clearInterval(gamepadPollTimer);
                    gamepadPollTimer = null;
                }
            }

            function onGamepadConnected() {
                recordActivity();
                if (!gamepadPollTimer) {
                    gamepadPollTimer = setInterval(pollGamepads, 500);
                }
            }

            function onGamepadDisconnected(e) {
                if (e && e.gamepad) {
                    delete previousGamepadState[e.gamepad.index];
                }
            }

            window.addEventListener('gamepadconnected', onGamepadConnected, { passive: true });
            window.addEventListener('gamepaddisconnected', onGamepadDisconnected, { passive: true });

            // If gamepads are already plugged in on page load
            if (typeof navigator.getGamepads === 'function') {
                try {
                    var initialGps = navigator.getGamepads();
                    if (initialGps && initialGps.some(function (g) { return !!g; })) {
                        onGamepadConnected();
                    }
                } catch (err) {}
            }

            function checkIdle(forceCheck) {
                if (window.__AUDITOR_MODE__ && !forceCheck) return;

                // Defer reload if a media stream or video is actively playing
                var playingVideos = document.querySelectorAll('video');
                for (var v = 0; v < playingVideos.length; v++) {
                    var vid = playingVideos[v];
                    if (!vid.paused && !vid.ended && vid.currentTime > 0) {
                        recordActivity();
                        return;
                    }
                }

                var elapsed = Date.now() - lastActivityTime;
                if (window.__idlePowerSave && typeof window.__idlePowerSave.getIdleTime === 'function') {
                    elapsed = window.__idlePowerSave.getIdleTime();
                }
                if (elapsed >= IDLE_TIMEOUT_MS) {
                    console.log('[PowerSave] 10 minutes of dormancy detected. Refreshing page to suspend WebGL animations and enter energy-conservation mode.');
                    if (window.__idlePowerSave && typeof window.__idlePowerSave._customReload === 'function') {
                        window.__idlePowerSave._customReload();
                    } else {
                        window.location.reload();
                    }
                }
            }

            // Periodic idle check every 10 seconds
            idleCheckTimer = setInterval(checkIdle, 10000);

            // Expose for testing and external status verification
            window.__idlePowerSave = {
                getIdleTime: function () { return Date.now() - lastActivityTime; },
                resetTimer: recordActivity,
                checkIdle: checkIdle,
                IDLE_TIMEOUT_MS: IDLE_TIMEOUT_MS,
                pollGamepads: pollGamepads
            };
        })();
    