/* ==========================================================================
   EstateMind 3D - 2D Interactive AI Floor Plan Generator
   ========================================================================== */

class FloorPlanEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.rooms = [];
    this.scale = 8; // pixels per foot
    
    this.initCanvasSize();
    window.addEventListener('resize', () => this.initCanvasSize());
  }

  initCanvasSize() {
    if (!this.canvas.parentElement) return;
    this.canvas.width = this.canvas.parentElement.clientWidth;
    this.canvas.height = 480;
    this.render();
  }

  setFloorplanData(roomsData) {
    this.rooms = roomsData || [];
    this.render();
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Grid
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    this.ctx.lineWidth = 1;
    const gridSize = 20;

    for (let x = 0; x < this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }

    // Draw Vastu Compass Rose
    this.drawVastuCompass();

    // Draw Rooms
    this.rooms.forEach((room) => {
      const rx = room.x * this.scale + 40;
      const ry = room.y * this.scale + 40;
      const rw = room.w * this.scale;
      const rh = room.h * this.scale;

      // Room Box Fill
      this.ctx.fillStyle = room.color || '#3b82f6';
      this.ctx.globalAlpha = 0.25;
      this.ctx.fillRect(rx, ry, rw, rh);

      // Border Walls
      this.ctx.globalAlpha = 1.0;
      this.ctx.strokeStyle = room.color || '#3b82f6';
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(rx, ry, rw, rh);

      // Label Text
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 13px Plus Jakarta Sans';
      this.ctx.fillText(room.name, rx + 8, ry + 22);

      // Dimension Text
      this.ctx.fillStyle = '#94a3b8';
      this.ctx.font = '11px Plus Jakarta Sans';
      this.ctx.fillText(`${room.w}' x ${room.h}'`, rx + 8, ry + 38);
    });
  }

  drawVastuCompass() {
    const cx = this.canvas.width - 60;
    const cy = 60;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 35, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#ef4444';
    this.ctx.font = 'bold 12px Plus Jakarta Sans';
    this.ctx.fillText('N', cx - 4, cy - 18);

    this.ctx.fillStyle = '#3b82f6';
    this.ctx.fillText('S', cx - 4, cy + 28);
    this.ctx.fillText('E', cx + 20, cy + 4);
    this.ctx.fillText('W', cx - 28, cy + 4);
  }
}

window.FloorPlanEngine = FloorPlanEngine;
