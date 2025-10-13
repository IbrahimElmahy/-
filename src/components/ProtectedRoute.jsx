// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

// هذا المكون يستقبل "الأطفال" (الصفحة التي نريد حمايتها) كـ prop
function ProtectedRoute({ children }) {
  // 1. ابحث عن تصريح الدخول (التوكن) في ذاكرة المتصفح
  const token = localStorage.getItem('authToken');

  // 2. إذا لم تجد التصريح...
  if (!token) {
    // ...أعد توجيه المستخدم إلى صفحة تسجيل الدخول
    return <Navigate to="/login" />;
  }

  // 3. إذا كان التصريح موجوداً، اسمح للـ "أطفال" بالظهور (اعرض الصفحة المطلوبة)
  return children;
}

export default ProtectedRoute;