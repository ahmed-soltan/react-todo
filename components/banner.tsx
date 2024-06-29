const Banner = ({ pathname }: { pathname: string }) => {
  return (
    <div
      className="w-full h-[250px] bg-gradient-to-r from-orange-500 to-orange-300 
  mb-8 flex flex-col justify-center items-start p-2 gap-2 rounded-md"
    >
      <h1 className="text-slate-100 text-3xl font-medium">
        Task Mangement App
      </h1>
      <p className="text-slate-100">
        Tasks {`${pathname === "/" ? "/Overview" : pathname}`}
      </p>
    </div>
  );
};

export default Banner;
