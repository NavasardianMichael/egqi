import logo from 'assets/images/logo.png'

type Props = {}

function Header({}: Props) {
  return (
    <div className='text-center d-flex flex-column' data-testid='header'>
      <h3>Digitizing the Economic Growth Quality Index</h3>
      <img className='mx-auto' style={{maxWidth: '100px'}} src={logo} />
    </div>
  )
}

export default Header