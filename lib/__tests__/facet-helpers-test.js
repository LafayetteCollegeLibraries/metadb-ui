import { expect } from 'chai'
import * as f from '../facet-helpers'

describe('lib/facet-helpers', function () {
  describe('#createFacetNameMap', function () {
    it('works with facets, using `value` as default field', function () {
      const facets = [
        {value: 'facet_val_1', label: 'Facet 1', hits: 100},
        {value: 'facet_val_3', label: 'Facet 3', hits: 12},
        {value: 'facet_val_2', label: 'Facet 2', hits: 77},
      ]

      const out = {
        'facet_val_1': 'Facet 1',
        'facet_val_3': 'Facet 3',
        'facet_val_2': 'Facet 2',
      }

      expect(f.createFacetNameMap(facets)).to.deep.equal(out)
    })

    it('works with variable `field` parameter', function () {
      const groups = [
        {name: 'facet-one', label: 'Facet One'},
        {name: 'facet-two', label: 'Facet Two'},
        {name: 'facet-three', label: 'Facet Three'},
      ]

      const out = {
        'facet-one': 'Facet One',
        'facet-two': 'Facet Two',
        'facet-three': 'Facet Three',
      }

      expect(f.createFacetNameMap(groups, 'name')).to.deep.equal(out)
    })
  })

  describe('#getBreadcrumbList', function () {
    it('converts a map of selected facets into an array of breadcrumb objects', function () {
      const pool = [
        {
          name: 'facet_list_1',
          label: 'Facet List 1',
        },
        {
          name: 'facet_list_2',
          label: 'Facet List 2',
        },
        {
          name: 'facet_list_3',
          label: 'Facet List 3',
        }
      ]

      const selected = {
        facet_list_2: [
          {label: 'Item 1', value: 'item_1'},
          {label: 'Item 3', value: 'item_3'},
        ],
        facet_list_1: [
          {label: 'Item 4', value: 'item_4'},
          {label: 'Item 2', value: 'item_2'},
        ]
      }

      const out = [
        {
          group: {
            name: 'facet_list_1',
            label: 'Facet List 1',
          },
          facet: {
            value: 'item_4',
            label: 'Item 4',
          },
        },
        {
          group: {
            name: 'facet_list_1',
            label: 'Facet List 1',
          },
          facet: {
            value: 'item_2',
            label: 'Item 2',
          }
        },
        {
          group: {
            name: 'facet_list_2',
            label: 'Facet List 2',
          },
          facet: {
            value: 'item_1',
            label: 'Item 1',
          }
        },
        {
          group: {
            name: 'facet_list_2',
            label: 'Facet List 2',
          },
          facet: {
            value: 'item_3',
            label: 'Item 3',
          }
        },
      ]

      expect(f.getBreadcrumbList(pool, selected)).to.deep.equal(out)
    })
  })
})
