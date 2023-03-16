import React from 'react';

import Counter from './Counter';

export default {
  title: 'Components/Counter',
  component: Counter,
  argTypes: {
  },
};

const Template = (args) => <Counter {...args} />;

export const Default = Template.bind({});
Default.args = {};