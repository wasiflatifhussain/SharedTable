const Footer = () => {
    return (
        <div className="bg-[#048a52] py-10">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <span className="text-3xl text-[#bae634] font-bold tracking-tight">
                    SharedTable
                </span>
                <span className="text-[#bae634] font-bold tracking-tight flex gap-4">
                    <span>Privacy Policy</span>
                    <span>Terms and Conditions</span>
                </span>
            </div>
        </div>
    )
}

export default Footer;