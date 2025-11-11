import React from 'react'
import { Layout } from 'antd'
const { Footer } = Layout

export default function FooterBar() {
  return (
    <Footer style={{ textAlign: 'center' }}>
      © {new Date().getFullYear()} webgoiysanpham — Built with React + Vite + Ant Design
    </Footer>
  )
}
