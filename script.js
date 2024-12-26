const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadForm = document.getElementById('uploadForm');
const videoPlayer = document.getElementById('videoPlayer');
const sampleVideo = document.getElementById('sampleVideo');
const MAX_FILE_SIZE_MB = 8;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const fileToggle = document.getElementById('fileToggle');
const textToggle = document.getElementById('textToggle');
const fileSection = document.getElementById('fileSection');
const textSection = document.getElementById('textSection');
const createMagicBtn = document.getElementById('createMagicBtn');

// Video control elements
const playPauseBtn = document.getElementById('playPauseBtn');
const muteBtn = document.getElementById('muteBtn');
const downloadBtn = document.getElementById('downloadBtn');
const createAgainBtn = document.getElementById('createAgainBtn');

// Add character counter functionality
const textInput = document.getElementById('textInput');
const charCount = document.getElementById('charCount');

textInput.addEventListener('input', () => {
    const count = textInput.value.length;
    charCount.textContent = count;
    
    // Optional: Add visual feedback when approaching limit
    if (count >= 900) {
        charCount.classList.add('text-pink-500');
    } else {
        charCount.classList.remove('text-pink-500');
    }
});

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#FF3366';
    dropZone.style.background = 'rgba(255, 51, 102, 0.1)';
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#333';
    dropZone.style.background = 'transparent';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
        fileInput.files = files;
        handleFileSelect(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleFileSelect(e.target.files[0]);
    }
});

function handleFileSelect(file) {
    if (file.size > MAX_FILE_SIZE_BYTES) {
        alert(`File size exceeds ${MAX_FILE_SIZE_MB} MB. Please upload a smaller file.`);
        fileInput.value = '';
        return;
    }
    dropZone.querySelector('p').textContent = `Selected: ${file.name}`;
}

createMagicBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    // Check which section is active
    const isFileActive = fileToggle.getAttribute('aria-pressed') === 'true';
    
    if (isFileActive) {
        // Handle file upload
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }
        await handleFileUpload(file);
    } else {
        // Handle text input
        const text = document.getElementById('textInput').value.trim();
        if (!text) {
            alert('Please enter some text.');
            return;
        }
        await handleTextSubmission(text);
    }
});

// Add these functions at the top of your script.js file
function showProgress(progress) {
    const popup = document.getElementById('progressPopup');
    const circle = document.querySelector('.progress-ring__circle');
    const progressText = document.getElementById('progressText');
    
    // Show popup if hidden
    popup.classList.remove('hidden');
    
    // Update progress
    const circumference = 126; // 2 * π * radius (20)
    const offset = circumference - (progress / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    progressText.textContent = `${Math.round(progress)}%`;
}

function hideProgress() {
    const popup = document.getElementById('progressPopup');
    popup.classList.add('hidden');
}

// Modify your handleFileUpload function
async function handleFileUpload(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userName', 'Brainrot Anything!');

    try {
        // Show initial progress
        showProgress(0);
        
        // Simulate progress while waiting for response
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 90) progress = 90;
            showProgress(progress);
        }, 1000);

        const response = await fetch('https://vibevision.ai/api/generate-video/brainrot', {
            method: 'POST',
            body: formData,
        });

        clearInterval(progressInterval);
        showProgress(100);
        
        if (!response.ok) throw new Error('Failed to upload file');

        const data = await response.json();
        
        // Hide progress after a brief delay
        setTimeout(() => {
            hideProgress();
        }, 1000);

        if (data.videoUrl) {
            document.getElementById('generatedVideoContainer').classList.remove('hidden');
            document.getElementById('sampleVideoContainer').classList.add('hidden');
            
            videoPlayer.src = data.videoUrl;
            videoPlayer.play();
            
            const downloadBtn = document.getElementById('downloadBtn');
            downloadBtn.href = data.videoUrl;
            downloadBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    // Try direct download first
                    const a = document.createElement('a');
                    a.href = data.videoUrl;
                    a.download = 'brainrot-video.mp4';
                    a.target = '_blank'; // Open in new tab if direct download fails
                    a.rel = 'noopener noreferrer';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                } catch (error) {
                    console.error('Download failed:', error);
                    // If direct download fails, open in new tab
                    window.open(data.videoUrl, '_blank');
                }
            });
        } else {
            alert('No video URL returned from the server.');
        }
    } catch (error) {
        hideProgress();
        alert('An error occurred: ' + error.message);
    }
}

// Similarly modify handleTextSubmission to include progress
async function handleTextSubmission(text) {
    const formData = new FormData();
    formData.append('text', text);
    formData.append('userName', 'Brainrot Anything!');

    try {
        // Show initial progress
        showProgress(0);
        
        // Simulate progress while waiting for response
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 90) progress = 90;
            showProgress(progress);
        }, 1000);

        const response = await fetch('https://vibevision.ai/api/generate-video/brainrot', {
            method: 'POST',
            body: formData,
        });

        clearInterval(progressInterval);
        showProgress(100);
        
        if (!response.ok) throw new Error('Failed to process text');

        const data = await response.json();
        
        // Hide progress after a brief delay
        setTimeout(() => {
            hideProgress();
        }, 1000);

        if (data.videoUrl) {
            document.getElementById('generatedVideoContainer').classList.remove('hidden');
            document.getElementById('sampleVideoContainer').classList.add('hidden');
            
            videoPlayer.src = data.videoUrl;
            videoPlayer.play();
            
            const downloadBtn = document.getElementById('downloadBtn');
            downloadBtn.href = data.videoUrl;
            downloadBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    // Try direct download first
                    const a = document.createElement('a');
                    a.href = data.videoUrl;
                    a.download = 'brainrot-video.mp4';
                    a.target = '_blank'; // Open in new tab if direct download fails
                    a.rel = 'noopener noreferrer';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                } catch (error) {
                    console.error('Download failed:', error);
                    // If direct download fails, open in new tab
                    window.open(data.videoUrl, '_blank');
                }
            });
        } else {
            alert('No video URL returned from the server.');
        }
    } catch (error) {
        hideProgress();
        alert('An error occurred: ' + error.message);
    }
}

// Add reset form function
function resetForm() {
    // Reset the forms
    uploadForm.reset();
    textForm.reset();
    
    // Reset the drop zone text
    dropZone.querySelector('p').textContent = 'Drop your files here or browse';
    
    // Reset video player
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
    videoPlayer.src = '';
    
    // Reset button states
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    videoPlayer.muted = false;
    
    // Reset download button
    downloadBtn.href = '#';
    
    // Hide generated video container and show sample container
    document.getElementById('generatedVideoContainer').classList.add('hidden');
    document.getElementById('sampleVideoContainer').classList.remove('hidden');
}

function setActiveToggle(activeButton, inactiveButton, showSection, hideSection) {
    // Update button states
    activeButton.setAttribute('aria-pressed', 'true');
    inactiveButton.setAttribute('aria-pressed', 'false');
    
    // Remove any hidden classes from buttons to ensure they're always visible
    activeButton.classList.remove('hidden');
    inactiveButton.classList.remove('hidden');
    
    // Update button styles while keeping both visible
    activeButton.classList.remove('bg-gray-700', 'text-gray-300');
    activeButton.classList.add('bg-gradient-to-r', 'from-pink-500', 'to-purple-600', 'text-white');
    
    inactiveButton.classList.remove('bg-gradient-to-r', 'from-pink-500', 'to-purple-600', 'text-white');
    inactiveButton.classList.add('bg-gray-700', 'text-gray-300');
    
    // Show/hide content sections
    showSection.classList.remove('hidden');
    hideSection.classList.add('hidden');
}

// Initialize button states
fileToggle.setAttribute('aria-pressed', 'true');
textToggle.setAttribute('aria-pressed', 'false');

// Add click handlers
fileToggle.addEventListener('click', () => {
    if (fileToggle.getAttribute('aria-pressed') === 'false') {
        setActiveToggle(fileToggle, textToggle, fileSection, textSection);
    }
});

textToggle.addEventListener('click', () => {
    if (textToggle.getAttribute('aria-pressed') === 'false') {
        setActiveToggle(textToggle, fileToggle, textSection, fileSection);
    }
});

// Make sure buttons are visible initially
fileToggle.classList.remove('hidden');
textToggle.classList.remove('hidden');

// Play/Pause functionality
playPauseBtn.addEventListener('click', () => {
    if (videoPlayer.paused) {
        videoPlayer.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        videoPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
});

// Mute/Unmute functionality
muteBtn.addEventListener('click', () => {
    videoPlayer.muted = !videoPlayer.muted;
    muteBtn.innerHTML = videoPlayer.muted ? 
        '<i class="fas fa-volume-mute"></i>' : 
        '<i class="fas fa-volume-up"></i>';
});

// Update play/pause button icon when video state changes
videoPlayer.addEventListener('play', () => {
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
});

videoPlayer.addEventListener('pause', () => {
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
});

// Create Again functionality
createAgainBtn.addEventListener('click', () => {
    resetForm();
});

// Update the video generation success handler
function handleVideoSuccess(videoUrl) {
    videoPlayer.src = videoUrl;
    downloadBtn.href = videoUrl;
    
    // Show generated video container and hide sample container
    document.getElementById('generatedVideoContainer').classList.remove('hidden');
    document.getElementById('sampleVideoContainer').classList.add('hidden');
    
    // Reset video controls to initial state
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    videoPlayer.muted = false;
} 