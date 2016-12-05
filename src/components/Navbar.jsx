import React from 'react'
import Link from 'react-router/lib/Link'

const T = React.PropTypes

const Navbar = React.createClass({
	render: function () {
		return (
			<header className="navbar">
				<Link to="/">MetaDB</Link>

				<nav className="site-navigation">
					<ul>
						<li>
							<Link to="/search">
								Search
							</Link>
						</li>

						<li>
							<Link to="/vocabularies">
								Vocabulary Manager
							</Link>
						</li>
					</ul>
				</nav>
			</header>
		)
	}
})

export default Navbar
