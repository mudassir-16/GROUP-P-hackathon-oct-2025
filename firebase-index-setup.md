# 🔥 Firebase Firestore Index Setup

## ⚠️ Required Index

Firebase requires a composite index for queries that filter by one field and order by another.

### 🔗 Create the Index

**Automatically via link:**
```
https://console.firebase.google.com/v1/r/project/openideax-d222b/firestore/indexes?create_composite=ClJwcm9qZWN0cy9vcGVuaWRlYXgtZDIyMmIvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2JsdWVwcmludHMvaW5kZXhlcy9fEAEaCgoGdXNlcklkEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg
```

**Or manually via Firebase Console:**

1. Go to: https://console.firebase.google.com/project/openideax-d222b/firestore/indexes
2. Click "Create Index"
3. Configure:
   - **Collection ID**: `blueprints`
   - **Fields to index**:
     - Field: `userId` | Order: Ascending
     - Field: `createdAt` | Order: Descending
   - Click "Create"

### 📝 Alternative: Query Without Ordering

If you want to avoid the index requirement, you can modify the query to not use `orderBy`:

```typescript
export const getUserBlueprints = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'blueprints'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const blueprints = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sort in JavaScript instead
    return blueprints.sort((a, b) => {
      const aDate = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const bDate = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return bDate - aDate;
    });
  } catch (error) {
    console.error('Error getting user blueprints:', error);
    throw error;
  }
};
```

### 🚀 Quick Fix

The easiest solution is to click the Firebase error link above. Firebase will automatically create the required index for you!

---

**Note**: The index creation may take a few minutes. The app will work once the index is ready.
