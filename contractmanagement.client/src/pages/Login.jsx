import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './Login.css';

// ไอคอนเครื่องหมายตกใจ (!) สีแดง
const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-exclamation-circle-fill error-icon" viewBox="0 0 16 16">
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
  </svg>
);

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState({
    username: '',
    password: '',
    general: ''
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('remembered_username');
    const savedPass = localStorage.getItem('remembered_password'); 

    if (savedUser && savedPass) {
      setUsername(savedUser);
      setPassword(savedPass);
      setRememberMe(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    let newErrors = { username: '', password: '', general: '' };
    let isValid = true;

    // 1. ตรวจสอบช่องว่าง (Validate Empty)
    if (!username.trim()) {
      newErrors.username = "กรุณากรอกชื่อผู้ใช้งาน";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    try {
      const response = await fetch('http://localhost:5056/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      // --- 🟢 จุดที่แก้ไข: ย้ายการอ่าน JSON เข้ามาใน if ---
      // เดิม: const data = await response.json(); (บรรทัดนี้ทำให้ Crash ถ้า Server ตอบ Text)
      
      if (response.ok) {
        // อ่าน JSON เฉพาะตอนที่ response.ok เป็นจริง (Login ผ่าน)
        const data = await response.json(); 

        // --- Login สำเร็จ ---
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);

        const role = username.toLowerCase().includes('admin') ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งานทั่วไป';
        localStorage.setItem('role', role);
        
        if (rememberMe) {
            localStorage.setItem('remembered_username', username);
            localStorage.setItem('remembered_password', password);
        } else {
            localStorage.removeItem('remembered_username');
            localStorage.removeItem('remembered_password');
        }

        navigate('/dashboard');
      } else {
        // --- 🔴 กรณี Login ไม่ผ่าน (401 Unauthorized) ---
        // ไม่ต้องอ่าน response.json() แล้ว ให้แสดง Error เลย
        // เพื่อป้องกัน SyntaxError: Unexpected token 'U' ...
        setErrors({
          username: "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง", 
          password: "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง",
          general: "" 
        });
      }
    } catch (err) {
      console.error(err);
      // กรณีเชื่อมต่อ Server ไม่ได้จริงๆ (Network Error)
      setErrors(prev => ({
        ...prev,
        password: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้", 
        general: ""
      }));
    }
  };

  return (
    <section className="min-vh-100 gradient-custom d-flex justify-content-center align-items-center py-5">
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            
            <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
              <div className="card-body p-3 p-md-4 text-center">

                <div className="mt-md-2 pb-2">

                  <div className="mb-0"> 
                    <img 
                      src="/company-logo.png" 
                      alt="Innovations Logo" 
                      className="logo-image img-fluid" 
                    />
                  </div>

                  <h2 className="fw-bold mb-2 text-uppercase">เข้าสู่ระบบ</h2>
                  <p className="text-white-50 mb-4" style={{fontSize: '0.9rem'}}>ระบบบริหารสัญญา</p>

                  <form onSubmit={handleLogin}>
                    
                    {/* Username Field */}
                    <div className="form-outline form-white mb-3 text-start">
                      <label className="form-label small" htmlFor="username">Username</label>
                      <div className="position-relative">
                        <input 
                          type="text" 
                          id="username" 
                          className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                          placeholder="ชื่อผู้ใช้งาน"
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value);
                            // เคลียร์ Error ทันทีที่เริ่มพิมพ์ใหม่
                            if(errors.username) setErrors(prev => ({...prev, username: ''}));
                          }}
                        />
                        {/* แสดงไอคอน Error (!) */}
                        {errors.username && <ErrorIcon />}
                      </div>
                      {/* ข้อความสีแดงใต้ช่อง */}
                      {errors.username && <div className="error-text">{errors.username}</div>}
                    </div>

                    {/* Password Field */}
                    <div className="form-outline form-white mb-3 text-start">
                      <label className="form-label small" htmlFor="password">Password</label>
                      <div className="position-relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          id="password" 
                          className={`form-control password-input ${errors.password ? 'is-invalid' : ''}`} 
                          placeholder="รหัสผ่าน"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if(errors.password) setErrors(prev => ({...prev, password: ''}));
                          }}
                        />
                        
                        {/* ไอคอนตา (จะขยับหลบซ้าย ถ้ามี Error) */}
                        {password && (
                          <span 
                            className={`eye-icon-btn ${errors.password ? 'with-error' : ''}`}
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                                <path d="M11.297 9.376a2.5 2.5 0 1 1-.719-2.665l.719.718.719-.718a2.5 2.5 0 0 1 .719 2.665zm-3.346-3.346a2.5 2.5 0 0 1 3.346 3.346l-.719-.719a1.5 1.5 0 0 0-1.908-1.908l-.719-.719z"/>
                                <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                              </svg>
                            )}
                          </span>
                        )}

                        {/* แสดงไอคอน Error (!) */}
                        {errors.password && <ErrorIcon />}
                      </div>
                      {/* ข้อความสีแดงใต้ช่อง */}
                      {errors.password && <div className="error-text">{errors.password}</div>}
                    </div>

                    <div className="d-flex justify-content-end align-items-center mb-4 small">
                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="rememberMe" 
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label className="form-check-label text-white-50" htmlFor="rememberMe">
                                จำรหัสผ่าน
                            </label>
                        </div>
                    </div>

                    <button 
                        className="btn btn-outline-light btn-lg px-5 login-glow-btn w-100" 
                        type="submit"
                        style={{fontSize: '1rem', padding: '10px 0'}}
                    >
                        เข้าสู่ระบบ
                    </button>
                  </form>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;