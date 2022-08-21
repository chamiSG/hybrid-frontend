import { Drawer } from "@material-ui/core";
import DrawerContent from "./drawer-content";

function Navbar() {
    return (
        <Drawer variant="persistent" anchor="top">
            <DrawerContent />
        </Drawer>
    );
}

export default Navbar;
