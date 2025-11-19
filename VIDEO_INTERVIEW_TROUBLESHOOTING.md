# 🔧 **Video Interview Troubleshooting Guide**

## 🎯 **Common Issues & Solutions:**

---

## **Issue 1: Backend Not Running**

### **Check if backend is running:**
```bash
cd backend
npm run dev
```

### **Should see:**
```
✅ Connected to MongoDB
🚀 Server running on port 5001
```

### **If you see error:**
- **EADDRINUSE** → Port already in use
  - Solution: Close other terminals running backend
  - Or: Change PORT in .env to 5002

---

## **Issue 2: "Join Interview" Button Not Working**

### **Possible Causes:**

#### **A. Browser Console Errors**
1. Press `F12` to open DevTools
2. Go to **Console** tab
3. Click "Join Interview"
4. Look for error messages

**Common Errors:**
- `Failed to fetch` → Backend not running
- `Network error` → Check backend URL
- `Token generation failed` → Agora credentials issue

#### **B. Backend Not Responding**
Test backend:
```bash
# Open new terminal
curl http://localhost:5001/api/v1/interviews
```

Should return JSON response (even if error, shows backend is running)

#### **C. Agora Credentials Invalid**
Check your `.env` file:
```env
AGORA_APP_ID=2c30d01c3d4640b69e73305f04de2cac
AGORA_APP_CERTIFICATE=8bf40fe5f44246d38ae74c2d19df2a59
```

**Verify:**
1. No spaces before/after `=`
2. No quotes around values
3. Credentials match Agora console

---

## **Issue 3: Video Room Opens But No Video**

### **Check Browser Permissions:**

#### **Chrome:**
1. Click 🔒 lock icon in address bar
2. Check Camera and Microphone permissions
3. Should be "Allow"
4. Refresh page if changed

#### **Firefox:**
1. Click 🔒 lock icon
2. Check permissions
3. Allow camera and microphone

### **Check Camera/Mic:**
1. Test in another app (Zoom, Teams)
2. Make sure not used by another app
3. Try different browser

---

## **Issue 4: "Failed to generate video token"**

### **Backend Logs Show Error:**

Check backend terminal for:
```
Error generating Agora token: [error message]
```

**Solutions:**
1. **Restart backend** after adding Agora credentials
2. **Check credentials** are correct
3. **Verify Agora project** is active

---

## 🚀 **Step-by-Step Debug Process:**

### **Step 1: Verify Backend**
```bash
cd backend
npm run dev
```

**Expected output:**
```
✅ Connected to MongoDB
🚀 Server running on port 5001
```

### **Step 2: Test Interview API**
Open browser to:
```
http://localhost:5001/api/v1/interviews
```

**Should see:**
- JSON response (even if empty array)
- NOT "Cannot GET" error

### **Step 3: Check Frontend**
```
http://localhost:3000/interviews
```

**Should see:**
- Interviews page loads
- Your scheduled interview
- "Join Interview" button visible

### **Step 4: Test Join**
1. Click "Join Interview"
2. Open DevTools (F12)
3. Go to Console tab
4. Look for errors

**Common errors and fixes:**

| Error | Solution |
|-------|----------|
| `Failed to fetch` | Backend not running |
| `404 Not Found` | Route not registered |
| `500 Server Error` | Check backend logs |
| `Token generation failed` | Agora credentials issue |
| `Network error` | Check CORS settings |

---

## 🎥 **Manual Test Without Video:**

You can test the interview system without Agora:

### **1. Schedule Interview:**
- ✅ Should work
- ✅ Email sent (if configured)
- ✅ Appears in interviews list

### **2. View Interview:**
- ✅ Click "Join Interview"
- ✅ Room page opens
- ✅ Shows interview details

### **3. Video Call:**
- ❌ Needs Agora credentials
- ❌ Won't connect without valid token

---

## 🔍 **Detailed Debugging:**

### **Check 1: Backend Logs**
Look in backend terminal for:
```
POST /api/v1/interviews/:id/token
```

**Good response:**
```
Status: 200
{ success: true, data: { token: "...", appId: "...", channelName: "..." } }
```

**Bad response:**
```
Status: 500
{ success: false, message: "Error generating video token" }
```

### **Check 2: Browser Network Tab**
1. F12 → Network tab
2. Click "Join Interview"
3. Look for request to `/interviews/:id/token`
4. Check response

**If 200 OK:** Token generated successfully
**If 500 Error:** Check backend logs
**If Failed:** Backend not running

### **Check 3: Agora Console**
1. Go to https://console.agora.io/
2. Check your project
3. Verify App ID matches .env
4. Check usage (should show 0 if not used yet)

---

## 💡 **Quick Fixes:**

### **Fix 1: Restart Everything**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

### **Fix 2: Clear Browser Cache**
```
Ctrl+Shift+Delete → Clear cache → Refresh
```

### **Fix 3: Test in Incognito**
```
Ctrl+Shift+N (Chrome)
Test join interview
```

### **Fix 4: Verify .env Format**
```env
# ✅ Correct
AGORA_APP_ID=2c30d01c3d4640b69e73305f04de2cac
AGORA_APP_CERTIFICATE=8bf40fe5f44246d38ae74c2d19df2a59

# ❌ Wrong
AGORA_APP_ID = 2c30d01c3d4640b69e73305f04de2cac
AGORA_APP_CERTIFICATE="8bf40fe5f44246d38ae74c2d19df2a59"
```

---

## 📞 **What to Check Right Now:**

1. **Is backend running?**
   - Check terminal for "Server running on port 5001"

2. **Can you access backend?**
   - Open: http://localhost:5001
   - Should see "Job Portal API"

3. **Is frontend running?**
   - Open: http://localhost:3000
   - Should see homepage

4. **Browser console errors?**
   - F12 → Console
   - Any red errors?

5. **Network tab shows requests?**
   - F12 → Network
   - Click join → See API calls?

---

## 🎊 **If Everything Fails:**

### **Simplest Test:**
1. **Open two browsers** (Chrome + Firefox)
2. **Login as employer** in Chrome
3. **Login as candidate** in Firefox
4. **Both go to interviews page**
5. **Both click "Join Interview"**
6. **See if they connect**

---

**Tell me which step fails and I'll help you fix it!** 🔧

**Common issue: Backend not running. Make sure you see "Server running on port 5001" in terminal!**
