import React from 'react'

import RecentItemsList from '../components/recent-items/RecentItemsList.jsx'

const Home = React.createClass({

  recentItems: function () {
    const props = {
      items: [
        {id: '2227mp65f', title: ['title4', 'another title']},
        {id: 'n009w228g', title: ['[ip0001] Chosen Customs, Set 3']},
        {id: 'b2773v68h', title: ['test silk road']},
        {id: '3f462540k', title: ['[Alpha Chi Rho Fraternity House]']},
        {id: '7d278t00k', title: ['MR. LE MIS. DE LA LAFAYETTE']},
      ],
      buildUrl: (item) => `/works/${item.id}`,
      title: 'Recent items'
    }
    
    return <RecentItemsList {...props}/>
  },

  render: function () {
    return (
    <div>
      <section className="recents">
        {this.recentItems()}
      </section>
    </div>
    )
  }
})

export default Home
