import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './Login.css';

// นำรูป Logo ของคุณมาใส่ตรงนี้
// import logoImg from './assets/innovations-logo.png'; 

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // State สำหรับสลับการมองเห็นรหัสผ่าน
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      const response = await fetch('http://localhost:5056/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('username', data.username);
        localStorage.setItem('token', data.token);
        
        if(rememberMe) {
            localStorage.setItem('remember_user', 'true');
        }

        alert(`ยินดีต้อนรับคุณ ${data.username}`);
        navigate('/dashboard');
      } else {
        alert(data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) {
      console.error(err);
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  return (
    <section className="vh-100 gradient-custom d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            
            {/* การ์ดสีดำ */}
            <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
              {/* ลด Padding จาก p-5 เป็น p-4 เพื่อให้กระชับขึ้น */}
              <div className="card-body p-4 text-center">

                <div className="mt-md-2 pb-2">

                  {/* --- LOGO --- */}
                  {/* เปลี่ยนจาก mb-4 หรือ mb-3 เป็น mb-1 เพื่อลดระยะห่างด้านล่าง */}
                  <div className="mb-0"> 
                    <img 
                      src="/company-logo.png" 
                      alt="Innovations Logo" 
                      className="logo-image" 
                      style={{ maxWidth: '220px', height: 'auto' }} /* คงขนาดเดิมไว้ตามที่ต้องการ */
                    />
                  </div>

                  <h2 className="fw-bold mb-2 text-uppercase">เข้าสู่ระบบ</h2>
                  <p className="text-white-50 mb-4" style={{fontSize: '0.9rem'}}>ระบบบริหารสัญญา</p>

                  <form onSubmit={handleLogin}>
                    
                    {/* Username Input */}
                    <div className="form-outline form-white mb-3 text-start">
                      <label className="form-label small" htmlFor="username">Username</label>
                      <input 
                        type="text" 
                        id="username" 
                        className="form-control" 
                        placeholder="ชื่อผู้ใช้งาน"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>

                    {/* Password Input + Eye Icon */}
                    <div className="form-outline form-white mb-3 text-start">
                      <label className="form-label small" htmlFor="password">Password</label>
                      <div className="position-relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          id="password" 
                          className="form-control password-input" 
                          placeholder="รหัสผ่าน"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        {/* ปุ่มลูกตา (วางซ้อนใน Input) */}
                        <span 
                          className="eye-icon-btn"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            // Eye Open SVG
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>
                            </svg>
                          ) : (
                            // Eye Slash SVG
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                              <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                              <path d="M11.297 9.376a2.503 2.503 0 1 1-.719-2.665l.719.718.719-.718a2.5 2.5 0 0 1 .719 2.665zm-3.346-3.346a2.5 2.5 0 0 1 3.346 3.346l-.719-.719a1.5 1.5 0 0 0-1.908-1.908l-.719-.719z"/>
                              <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                            </svg>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Remember & Forgot */}
                    <div className="d-flex justify-content-between align-items-center mb-4 small">
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
                        <a className="text-white-50 fw-bold text-decoration-none" href="#!">
                            ลืมรหัสผ่าน?
                        </a>
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