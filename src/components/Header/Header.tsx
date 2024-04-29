import logo from 'assets/images/logo.png'

function Header() {
  return (
    <div className='d-flex align-items-center p-3 flex-wrap' style={{gap: 20}} data-testid='header'>
      <img style={{maxWidth: 90}} src={logo} alt='EGQI logo' />
      <div>
        <h5 className='text-secondary mb-0'>Digitizing the Quality of Economic Development</h5>
        <p className='block text-secondary mb-0 w-100 '>Proposing the Index of Quality of Economic Output (EOQI)</p>
      </div>
    </div>
  )
}

export default Header