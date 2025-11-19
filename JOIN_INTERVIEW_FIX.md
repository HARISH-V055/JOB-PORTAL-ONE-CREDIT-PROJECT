# 🎥 **Join Interview - Complete Setup Guide**

## ✅ **What I Fixed:**

I've enabled **TEST MODE** so you can join interviews anytime (not just 1 hour before).

---

## 🚀 **To Make Video Calls Work:**

### **Step 1: Get Agora Credentials (Free)**

1. **Go to:** https://console.agora.io/
2. **Sign up** (free account)
3. **Create a project:**
   - Click "Project Management"
   - Click "Create"
   - Name: "Job Portal"
   - Mode: "Secured mode: APP ID + Token"
   - Click "Submit"

4. **Copy Your Credentials:**
   - **App ID** - Copy this (visible on project list)
   - **App Certificate** - Click "Edit" → "Generate" → Copy

---

### **Step 2: Add to .env File**

Open `backend/.env` and add:

```env
# Agora Video Call Credentials
AGORA_APP_ID=paste_your_app_id_here
AGORA_APP_CERTIFICATE=paste_your_certificate_here
```

**Example:**
```env
AGORA_APP_ID=a1b2c3d4e5f6g7h8i9j0
AGORA_APP_CERTIFICATE=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
```

---

### **Step 3: Restart Backend**

```bash
# Stop backend (Ctrl+C)
cd backend
npm run dev
```

---

## 🎯 **How to Test:**

### **1. Schedule an Interview:**
```
Dashboard → Applications → Schedule Interview
- Set any future date/time
- Click "Schedule"
```

### **2. View Interview:**
```
Click 🎥 Interviews in navbar
- You'll see your scheduled interview
- "Join Interview" button should be visible (TEST MODE enabled)
```

### **3. Join Video Call:**
```
Click "Join Interview"
- Allow camera & microphone permissions
- Video call room opens
- Click "Join Interview" button in the room
- Video call starts!
```

---

## 🔧 **Troubleshooting:**

### **Issue: "Join Interview" Button Not Showing**
**Solution:**
- Interview must be "scheduled" status
- TEST MODE is now enabled (joins anytime)
- Refresh the page

### **Issue: Video Call Doesn't Start**
**Possible Causes:**
1. **No Agora credentials** - Add to .env file
2. **Backend not restarted** - Restart after adding credentials
3. **Browser permissions** - Allow camera & microphone
4. **Wrong credentials** - Double-check App ID and Certificate

### **Issue: "Failed to join video call"**
**Check:**
1. **Backend running?** - Check terminal
2. **Credentials correct?** - Check .env file
3. **Browser console** - F12 → Console for errors

---

## 📋 **Complete Flow:**

### **Employer:**
```
1. Dashboard → Job → Applications
2. Click "Schedule Interview"
3. Fill form → Submit
4. Go to Interviews page
5. Click "Join Interview" (TEST MODE - works anytime)
6. Allow permissions
7. Click "Join Interview" in room
8. Video call starts!
```

### **Candidate:**
```
1. Receive email notification
2. Go to Interviews page
3. See scheduled interview
4. Click "Join Interview"
5. Allow permissions
6. Click "Join Interview" in room
7. Wait for interviewer
8. Video call starts!
```

---

## 🎊 **What's Working Now:**

### **✅ With TEST MODE:**
- Join button appears for all scheduled interviews
- No time restrictions
- Perfect for testing

### **✅ With Agora Credentials:**
- Video calls work
- HD quality
- Audio/video controls
- Screen sharing ready

### **✅ Without Agora Credentials:**
- UI works
- Can schedule interviews
- Can see interviews list
- Video calls won't start (need credentials)

---

## 💡 **Production Mode:**

When ready for production, change in `Interviews.tsx`:

```typescript
const TEST_MODE = false; // Change to false
```

This will:
- Only allow joining 1 hour before interview
- Prevent early joins
- More professional

---

## 🚀 **Quick Test (No Agora Needed):**

You can test the UI without Agora:

1. **Schedule interview** - Works ✅
2. **View interviews** - Works ✅
3. **See join button** - Works ✅ (TEST MODE)
4. **Click join** - Opens room ✅
5. **Video call** - Needs Agora ❌

---

## 📞 **Get Agora (2 Minutes):**

1. https://console.agora.io/
2. Sign up
3. Create project
4. Copy App ID
5. Generate & copy Certificate
6. Add to .env
7. Restart backend
8. Test video call!

---

**The "Join Interview" button now works anytime in TEST MODE!** 🎥

**To enable video calls, just add Agora credentials!** ✨
