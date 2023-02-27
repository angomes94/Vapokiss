export default {
    name: 'promo',
    title: 'Promo',
    type: 'document',
    fields: [
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
      {
          name: 'name',
          title: 'Name',
          type: 'string',
      }, {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
            source: 'name',
            maxLength: 90
        }
    },
        {
            name: 'buttonDesc',
            title: 'ButtonDesc',
            type: 'string',
        },
        {
            name: 'newPrice',
            title: 'NewPrice',
            type: 'string',
        },
        {
            name: 'oldPrice',
            title: 'OldPrice',
            type: 'string',
        },
        {
            name: 'smallText',
            title: 'SmallText',
            type: 'string',
        },
    ],
  };