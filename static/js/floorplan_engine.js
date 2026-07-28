/* ==========================================================================
   EstateMind 3D - 2D Interactive AI Floor Plan Generator Engine
   ========================================================================== */

class FloorPlanEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.rooms = [];
    this.scale = 7.5; // pixels per foot
    this.selectedRoom = null;
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    
    this.initCanvasSize();
    this.initEvents();
    window.addEventListener('resize', () => this.initCanvasSize());
  }

  initCanvasSize() {
    if (!this.canvas.parentElement) return;
    this.canvas.width = this.canvas.parentElement.clientWidth;
    this.canvas.height = 500;
    this.render();
  }

  initEvents() {
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('mouseup', () => this.onMouseUp());
    this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
    this.canvas.addEventListener('touchend', () => this.onMouseUp());
  }

  setFloorplanData(roomsData) {
    this.rooms = roomsData || [];
    this.render();
  }

  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  onMouseDown(e) {
    const pos = this.getMousePos(e);
    for (let i = this.rooms.length - 1; i >= 0; i--) {
      const room = this.rooms[i];
      const rx = room.x * this.scale + 30;
      const ry = room.y * this.scale + 30;
      const rw = room.w * this.scale;
      const rh = room.h * this.scale;

      if (pos.x >= rx && pos.x <= rx + rw && pos.y >= ry && pos.y <= ry + rh) {
        this.selectedRoom = room;
        this.isDragging = true;
        this.dragOffsetX = pos.x - rx;
        this.dragOffsetY = pos.y - ry;
        this.render();
        return;
      }
    }
    this.selectedRoom = null;
    this.render();
  }

  onMouseMove(e) {
    if (!this.isDragging || !this.selectedRoom) return;
    const pos = this.getMousePos(e);
    
    // Snap to grid (snap to 0.5 ft increments)
    const newFtX = Math.max(0, Math.round(((pos.x - this.dragOffsetX - 30) / this.scale) * 2) / 2);
    const newFtY = Math.max(0, Math.round(((pos.y - this.dragOffsetY - 30) / this.scale) * 2) / 2);

    this.selectedRoom.x = newFtX;
    this.selectedRoom.y = newFtY;
    this.render();
  }

  onMouseUp() {
    this.isDragging = false;
  }

  onTouchStart(e) {
    e.preventDefault();
    this.onMouseDown(e);
  }

  onTouchMove(e) {
    e.preventDefault();
    this.onMouseMove(e);
  }

  addRoom(name, w, h, color) {
    const room = {
      name: name || 'New Room',
      x: 10 + (this.rooms.length * 3) % 20,
      y: 10 + (this.rooms.length * 3) % 20,
      w: w || 12,
      h: h || 12,
      color: color || '#3b82f6'
    };
    this.rooms.push(room);
    this.selectedRoom = room;
    this.render();
  }

  deleteSelectedRoom() {
    if (!this.selectedRoom) return;
    this.rooms = this.rooms.filter(r => r !== this.selectedRoom);
    this.selectedRoom = null;
    this.render();
  }

  exportPNG() {
    const link = document.createElement('a');
    link.download = 'EstateMind_AI_FloorPlan.png';
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Grid (Blueprint style)
    this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.08)';
    this.ctx.lineWidth = 1;
    const gridSize = 15;

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
      const rx = room.x * this.scale + 30;
      const ry = room.y * this.scale + 30;
      const rw = room.w * this.scale;
      const rh = room.h * this.scale;

      const isSelected = room === this.selectedRoom;

      // Fill
      this.ctx.fillStyle = room.color || '#3b82f6';
      this.ctx.globalAlpha = isSelected ? 0.45 : 0.25;
      this.ctx.fillRect(rx, ry, rw, rh);

      // Outer Thick Wall Border
      this.ctx.globalAlpha = 1.0;
      this.ctx.strokeStyle = isSelected ? '#ffffff' : (room.color || '#3b82f6');
      this.ctx.lineWidth = isSelected ? 4 : 3;
      this.ctx.strokeRect(rx, ry, rw, rh);

      // Door Marker Arch (Top Left Wall Door Mock)
      this.ctx.strokeStyle = '#f59e0b';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(rx + 14, ry, 10, 0, Math.PI / 2);
      this.ctx.stroke();

      // Room Name Label
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 12px Plus Jakarta Sans';
      this.ctx.fillText(room.name, rx + 8, ry + 20);

      // Room Dimension Label
      this.ctx.fillStyle = '#cbd5e1';
      this.ctx.font = '10px Plus Jakarta Sans';
      this.ctx.fillText(`${room.w}' × ${room.h}' (${Math.round(room.w * room.h)} sqft)`, rx + 8, ry + 36);

      if (room.vastu_note) {
        this.ctx.fillStyle = '#10b981';
        this.ctx.font = '9px Plus Jakarta Sans';
        this.ctx.fillText(`✓ ${room.vastu_note}`, rx + 8, ry + 50);
      }
    });
  }

  drawVastuCompass() {
    const cx = this.canvas.width - 50;
    const cy = 50;
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = 1.5;

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = '#ef4444';
    this.ctx.font = 'bold 12px Plus Jakarta Sans';
    this.ctx.fillText('N', cx - 4, cy - 16);

    this.ctx.fillStyle = '#3b82f6';
    this.ctx.fillText('S', cx - 4, cy + 24);
    this.ctx.fillText('E', cx + 16, cy + 4);
    this.ctx.fillText('W', cx - 24, cy + 4);
  }
}

window.FloorPlanEngine = FloorPlanEngine;
