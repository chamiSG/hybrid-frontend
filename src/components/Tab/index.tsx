import React from "react";

import { Tabs, Tab, Box, Button, Typography, Card } from "@material-ui/core";
import "./tab.scss";
import TabPanel from "./TabPanel";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabContainer(props: any) {

  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  const CustomPriceCard = React.useMemo(
    () =>
      React.forwardRef((linkProps, ref) => (
        <Button {...linkProps}>
          <Card className="price-card">
            <div>Test</div>
            <div>Test12233</div>
          </Card>
        </Button>
      )),
    [],
  );

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab component={CustomPriceCard} {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </>
  )
}

export default TabContainer;
