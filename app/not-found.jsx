import Image from "next/image";

export default function NotFound() {

    return(
        <div className="flex justify-center items-center">
            <Image 
                src={"/Notfound.png"}
                alt="Notfound"
                width={800}
                height={400}
                className="w-auto object-contain"
            />
        </div>
    );
}