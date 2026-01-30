/**
 * Orbiting Circles Animation
 * Clean implementation for platform logos orbiting around center
 */

document.addEventListener('DOMContentLoaded', function() {
  initOrbitingCircles();
});

function initOrbitingCircles() {
  const orbitPaths = document.querySelectorAll('.orbit-path');
  
  orbitPaths.forEach((orbitPath, pathIndex) => {
    const items = orbitPath.querySelectorAll('.orbit-item');
    const radius = parseFloat(getComputedStyle(orbitPath).width) / 2;
    const itemCount = items.length;
    
    items.forEach((item, index) => {
      // Calculate initial angle for even distribution
      const angle = (360 / itemCount) * index;
      item.dataset.angle = angle;
      
      // Position item on the orbit
      positionOrbitItem(item, angle, radius);
    });
    
    // Start animation
    animateOrbit(orbitPath, pathIndex);
  });
}

function positionOrbitItem(item, angle, radius) {
  // Convert angle to radians
  const rad = (angle - 90) * (Math.PI / 180);
  
  // Calculate x, y position
  const x = radius + radius * Math.cos(rad);
  const y = radius + radius * Math.sin(rad);
  
  // Position the item
  item.style.left = `${x - (item.offsetWidth / 2)}px`;
  item.style.top = `${y - (item.offsetHeight / 2)}px`;
}

function animateOrbit(orbitPath, pathIndex) {
  const items = orbitPath.querySelectorAll('.orbit-item');
  const radius = parseFloat(getComputedStyle(orbitPath).width) / 2;
  
  // Different speeds for different orbits
  const speeds = [0.02, -0.015]; // Negative for reverse direction
  const speed = speeds[pathIndex % speeds.length];
  
  function animate() {
    items.forEach(item => {
      // Get current angle and update it
      let angle = parseFloat(item.dataset.angle);
      angle += speed;
      
      // Keep angle in 0-360 range
      if (angle > 360) angle -= 360;
      if (angle < 0) angle += 360;
      
      item.dataset.angle = angle;
      
      // Update position
      positionOrbitItem(item, angle, radius);
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

// Handle window resize
let resizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    initOrbitingCircles();
  }, 250);
});
