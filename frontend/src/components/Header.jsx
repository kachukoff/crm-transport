function Header({ title, actions }) {
  return (
    <header className="header">
      <div>
        <h1 className="header__title">{title}</h1>
      </div>
      {actions && (
        <div className="header__actions">
          {actions}
        </div>
      )}
    </header>
  )
}

export default Header