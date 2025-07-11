import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import UserMenu from "./user-menu";
import { checkUser } from "@/lib/checkUser";
import UserLoading from "./user-loading";

const Header = async() => {
    await checkUser();
    return(
        <header className="container mx-auto">
            <nav className="py-6 px-4 flex justify-between items-center">
                <Link href="/">
                    <h1 className="text-2xl font-bold">
                    <Image
                    src={"/Logo.png"}
                    alt="PlanCraft Logo"
                    width={200}
                    height={56}
                    className="h-11 w-auto object-contain"
                    />
                    </h1>
                </Link>
                <div className="flex items-center gap-2">
                    <Link href="/project/create">
                        <Button variant={"destructive"} className="flex items-center gap-2">
                            <PenBox size={18}/>
                            <span>Create Project</span>
                        </Button>
                    </Link>

                    <SignedOut>
                        <SignInButton forceRedirectUrl="/onboarding">
                            <Button variant={"outline"}>Login</Button>
                        </SignInButton>
                    </SignedOut>

                    <SignedIn>
                        <UserMenu />
                    </SignedIn>
                </div>
            </nav>

            <UserLoading/>
        </header>
    );
};

export default Header;