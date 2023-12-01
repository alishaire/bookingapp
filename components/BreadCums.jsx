import Link from "next/link";
import { useRouter } from "next/router";

const BreadCums = (props) => {
  const { back } = useRouter();

  return (
    <>
      {/* badCrumps here */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2 text-[#1553A1]">
          <button
            className="flex items-center gap-2 font-semibold text-blue-600 hover:opacity-90"
            onClick={() => back()}
          >
            Return to Back
            <i className="bx bx-chevron-right text-lg"></i>
          </button>
          <span className="text-[#1554a1cb] font-semibold">
            {props.Heading}
          </span>
        </div>
        <div className="flex items-center">
          <Link
            href={"/portal/profile/edit"}
            className="bg-blue-600 flex items-center gap-1 text-white rounded-full px-3 py-1 text-sm cursor-pointer transition-colors hover:bg-indigo-700"
          >
            <i className="bx bx-plus text-base"></i>
            {props.BtnText}
          </Link>
        </div>
      </div>
    </>
  );
};

export default BreadCums;