import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "./ui/button";

const MobileNav = () => {
    return (
        <Sheet>
            <SheetTrigger>
                <Menu className="text-[#048a52]" />
            </SheetTrigger>
            <SheetContent className="space-y-3">
                <SheetTitle>
                    <span>Welcome to SharedTable!</span>
                </SheetTitle>
                <Separator />
                <SheetDescription className="flex">
                    <Button className="flex-1 font-bold bg-[#048a52]">Log In</Button>
                </SheetDescription>
            </SheetContent>
        </Sheet>
    )
}
  
export default MobileNav;