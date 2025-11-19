# 🌙 Dark Mode Testing Guide

## 🔧 **How to Test Dark Mode:**

### **Step 1: Open Browser Console**
1. Press `F12` or `Ctrl+Shift+I`
2. Go to **Console** tab
3. Look for any errors

### **Step 2: Check Theme Toggle**
1. **Refresh your browser**
2. **Click the moon icon (🌙)** in navbar (next to Logout button)
3. **Check console** - should see "Dark mode applied"
4. **Click sun icon (☀️)** - should see "Light mode applied"

### **Step 3: Manual Check**
1. Open **Developer Tools** (F12)
2. Go to **Elements** tab
3. Look at `<html>` element
4. When dark mode is ON, it should have `class="dark"`
5. When light mode is ON, the `dark` class should be removed

### **Step 4: Verify Styles**
In dark mode, you should see:
- **Background:** Dark gray/black
- **Text:** White/light gray
- **Navbar:** Dark background
- **Cards:** Dark gray background

## 🐛 **If Dark Mode Isn't Working:**

### **Check 1: HTML Class**
```html
<!-- Light Mode -->
<html>

<!-- Dark Mode -->
<html class="dark">
```

### **Check 2: Console Logs**
Should see:
```
Dark mode applied
```
or
```
Light mode applied
```

### **Check 3: localStorage**
1. Open **Application** tab in DevTools
2. Go to **Local Storage**
3. Check if `theme` key exists with value `"dark"` or `"light"`

## 🔄 **Manual Fix:**

If it's not working, try this in console:
```javascript
// Force dark mode
document.documentElement.classList.add('dark');

// Force light mode  
document.documentElement.classList.remove('dark');
```

## 🎯 **Expected Behavior:**

1. **Click moon icon** → Background turns dark, text turns light
2. **Click sun icon** → Background turns light, text turns dark
3. **Refresh page** → Theme persists (saved in localStorage)

---

**If you still don't see dark mode working, let me know what you see in the console!** 🔍
