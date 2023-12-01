import axios from "axios";
import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const register = () => {
  const [file, setFile] = useState("");
  const [loading,setLoading] = useState(false)
  const [input, setInput] = useState({
    name:"",
    phone:"",
    email:"",
    password:"",
    photo:"",
    gender:""
  })
  const uploadCloudinary = async () => {
    try {
  
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "r6qmrhq9");
      data.append("cloud_name", "dltmv6mfa");
   
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dltmv6mfa/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const cloudinaryResponse = await res.json();
     return cloudinaryResponse.secure_url
    } catch (error) {
      console.log(error);
    }
  };
  const inputhandler = (e)=>{
const {name, value} =  e.target
setInput({...input,[name]:value})

  }

  const submitehandler = async (e) => {
    setLoading(true)
    try {
e.preventDefault()
  const imageurl =  await uploadCloudinary();
   const res = await axios.post("/api/user/register", {
    ...input,
    photo:imageurl
   })
   res && toast.success("You Has Been Registered Successfully")
   setInput({
    name:"",
    phone:"",
    email:"",
    password:"",
    photo:"",
    gender:""
  })
  setFile("")
setLoading(false)
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
setLoading(false)

    }
  };
  return (
    <>
     <ToastContainer />
      <div className="h-screen flex flex-col justify-center">
        <div className="w-full p-2">
          <h1 className="text-center font-light text-5xl mt-6 text-[#38BDF8] max-w-[1200px] mx-auto">
            {" "}
            Register Your Self
          </h1>

          <div className="max-w-[1200px] border mx-auto p-2 mt-3">
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4 "
              onSubmit={submitehandler}
            >
              <div></div>
              <div className="flex justify-end">
                {file ? (
                  <>
                    <div className="relative">
                      <i
                        onClick={() => setFile("")}
                        className="fa-solid flex justify-center items-center w-5 h-5 fa-xmark absolute -right-1 -top-2 rounded-full text-white bg-red-600 text-white-600 text-xl"
                      ></i>
                      <img
                        className="w-20 h-20  rounded-full "
                        src={URL.createObjectURL(file)}
                        alt=""
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <label htmlFor="file" className="cursor-pointer relative">
                      <img
                        className="w-20 h-20  rounded-full "
                        src="https://iau.edu.lc/wp-content/uploads/2016/09/dummy-image.jpg"
                        alt=""
                      />
                    </label>
                    <input
                      className="hidden"
                      onChange={(e) => setFile(e.target.files[0])}
                      type="file"
                      id="file"
                    />
                  </>
                )}
              </div>

              <div className="w-full">
                <label htmlFor="">Name</label>
                <input
                  className="border rounded-sm py-1 px-2 border-[#b6b6b6] w-full"
                  type="text"
                  placeholder="Enter Your Name"
                  name="name"
                  onChange={inputhandler}
                  value={input.name}
                />
              </div>
              <div>
                <label htmlFor="">Email</label>
                <input
                  className="border rounded-sm py-1 px-2 border-[#b6b6b6] w-full"
                  type="email"
                  placeholder="Enter Your Email"
                  name="email"
                  onChange={inputhandler}
                  value={input.email}
                />
              </div>
              <div>
                <label htmlFor="">Password</label>
                <input
                  className="border rounded-sm py-1 px-2 border-[#b6b6b6] w-full"
                  type="password"
                  placeholder="Enter Your Password"
                  name="password"
                  onChange={inputhandler}
                  value={input.password}
                />
              </div>
              <div>
                <label htmlFor="">Phone</label>
                <input
                  className="border py-1 px-2 border-[#b6b6b6] w-full"
                  type="number"
                  placeholder="Enter Your Number"
                  name="phone"
                  onChange={inputhandler}
                  value={input.phone}
                />
              </div>
              <div>
                <label htmlFor="">Gender</label>

                <div className="flex">
                  <div className="flex items-center me-4">
                    <input
                  
                      id="inline-radio"
                      type="radio"
                      value="male"
                      name="gender"
                      onChange={inputhandler}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="inline-radio"
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Male
                    </label>
                  </div>
                  <div className="flex items-center me-4">
                    <input
                      id="inline-2-radio"
                      type="radio"
                      value="female"
                      name="gender"
                      onChange={inputhandler}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="inline-2-radio"
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Female
                    </label>
                  </div>
                  <div className="flex items-center me-4">
                    <input
                      id="inline-checked-radio"
                      type="radio"
                      value="other"
                      name="gender"
                      onChange={inputhandler}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="inline-checked-radio"
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Others
                    </label>
                  </div>
                </div>
              </div>
              <div>
              </div>
              <div>
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  {loading?   " Register..." : "Register"}
               
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default register;
