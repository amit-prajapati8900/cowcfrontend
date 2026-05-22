import React from 'react'

export default function Footer(){
  return(
  <div className='container-fluid' style={{borderTop:"1px solid black"}}>
    <div className='row'>
      <div className='col-4' style={{display:'flex', justifyContent :"center", flexDirection:"column"}}>
         <p>watercorpo.in</p>
         <p> <i className="fab fa-twitter fa-lg"></i></p>
         <p> <i className="fab fa-facebook fa-lg"></i></p>
         <p> <i className="fab fa-linkedin fa-lg"></i></p>
         <p> <i className="fab fa-instagram fa-lg"></i></p>
      </div>
      <div className='col-8 mt-5'>
         <p>© 2026 Water Corporation Management System</p>
      <p>Developed by Amit | All rights reserved</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident consequatur perferendis exceptur.</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident consequatur perferendis exceptur.</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident consequatur perferendis exceptur.</p>
      
      </div>
    </div>
  </div>
  )
}