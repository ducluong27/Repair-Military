import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Repair-Military/', // Sửa thành chữ R và M viết hoa đúng theo tên thư mục của bạn
})