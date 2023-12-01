import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import queryString from "query-string";
import { SessionProvider } from "@/Context";

const index = () => {
  const { user } = useContext(SessionProvider);

  const [filter, setFilter] = useState("");
  const [isApproved, setIsApproved] = useState("");
  const [bookingarea, setBookingarea] = useState([]);

  const [model, setModel] = useState(false);
  const [facilitiestags, setFacilitiestags] = useState([]);
  const [data, setdata] = useState();
  const [updateMode, setUpdateMode] = useState(false);
  const [images, setImages] = useState([]);
  const [tempImgs, setTempImgs] = useState([]);
  const [addbooking, setAddBooking] = useState({
    title: "",
    size: "",
    owner: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",

    images: [],
    facilities: [],
    pricePerHour: "",
    type: "",
    openingHours: [
      {
        day: "",
        startTime: "",
        endTime: "",
      },
    ],
  });

  const fetchdata = async () => {
    const searchfield = queryString.stringify({
      keyword: filter,
      isApproved: isApproved,
    });

    const res = await axios.get(`/api/getbookingareas?${searchfield}`);
    setBookingarea(res.data.bookings.data);
  };
  useEffect(() => {
    fetchdata();
    // setTimeout(() => {
    //   setIsApproved('')
    // }, 10000);
  }, [filter, isApproved]);

  // Adding Facilities====================================================>
  const addTag = (e) => {
    e.preventDefault();
    var copy = facilitiestags;
    copy.push(data);
    setFacilitiestags(copy);
    setdata("");
  };
  const handlekeydown = (e) => {
    if (e.key === "Enter") {
      addTag(e);
    }
  };

  const handleDel = (i) => {
    const updatetags = [...facilitiestags];
    updatetags.splice(i, 1);
    setFacilitiestags(updatetags);
  };
  // Adding Timngs =======================================================>
  const addTimings = () => {
    setAddBooking({
      ...addbooking,
      openingHours: [
        ...addbooking.openingHours,
        {
          day: "",
          startTime: "",
          endTime: "",
        },
      ],
    });
  };

  // Adding Images =====================================================>
  const handleFileInputChange = async (e) => {
    setImages(e.target.files);
    setTempImgs(
      Object.keys(e.target.files).map((key, i) => {
        return URL.createObjectURL(e.target.files[key]);
      })
    );
  };
  const deleteImage = (index) => {
    const UpdateImage = [...tempImgs];
    UpdateImage.splice(index, 1);
    setTempImgs(UpdateImage);

    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };
  const uploadImages = async () => {
    const tempImages = [];

    try {
      for (let i = 0; i < images.length; i++) {
        const data = new FormData();

        data.append("file", images[i]);
        data.append("upload_preset", "r6qmrhq9");
        data.append("cloud_name", "dltmv6mfa");
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dltmv6mfa/image/upload",
          {
            method: "POST",
            body: data,
          }
        );

        const jsonRes = await res.json();
        tempImages.push(jsonRes.secure_url);
      }
    } catch (error) {
      alert(error);
    } finally {
      return tempImages;
    }
  };
  // Adding Data =========================================================>
  const inputhandler = (e, id) => {
    const { name, value } = e.target;
    if (name.startsWith("address")) {
      setAddBooking({
        ...addbooking,
        address: {
          ...addbooking.address,
          [name.split(".")[1]]: value,
        },
      });
      return;
    }
    if (name === "day" || name === "startTime" || name === "endTime") {
      const newtiming = addbooking.openingHours.map((v, i) => {
        if (i === id) {
          return { ...v, [name]: value };
        }
        return v;
      });

      setAddBooking({ ...addbooking, openingHours: newtiming });
    } else {
      setAddBooking({ ...addbooking, [name]: value });
    }
  };
  // Submiting Data ====================================================>

  const handleUpdate = (selectedBooking) => {
    setAddBooking(selectedBooking); // Set the form fields with the selected booking data
    setUpdateMode(true); // Set the update mode to true
    setModel(true); // Open the modal for editing
  };

  // Update the form submission function to handle both adding and updating
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (updateMode) {
      // If in update mode, call the update function with the current form data
      await updateBooking(addbooking);
      setUpdateMode(false); // Reset update mode after updating
    } else {
      // If not in update mode, proceed with the existing submit logic for adding
      const uploadedImages = await uploadImages();
      const res = await axios.post(`/api/bookingarea/addbookingarea`, {
        ...addbooking,
        facilities: facilitiestags,
        images: uploadedImages,
        owner:user?._id
      });

      if (res.data.success) {
        toast.success("Booking Area Added Successfully");
        // Additional logic if needed
      } else {
        toast.error("Failed to add Booking Area");
      }
    }

    // Reset form fields and state after submission
    setAddBooking({
      title: "",
      size: "",

      street: "",
      city: "",
      state: "",
      country: "",
      zip: "",

      images: [],
      facilities: [],
      pricePerHour: "",
      type: "",
      openingHours: [
        {
          day: "",
          startTime: "",
          endTime: "",
        },
      ],
    });
    setFacilitiestags([]);
    setTempImgs([]);
    setImages([]);
    setdata("");
    setModel(false);
  };

  // Updateing The Data ==================================================>
  const updateBooking = async (bookingData) => {
    try {
      const updatedImages = await uploadImages(); // Upload any new images
      const existingImages = bookingData.images;

      const updatedBookingData = {
        ...bookingData,
        facilities: [...facilitiestags],
        images: [...existingImages, ...updatedImages], // Use existing images if no new images are selected
      };

      const res = await axios.put(
        `/api/bookingarea/${bookingData._id}`,
        updatedBookingData
      );

      if (res.data.success) {
        toast.success("Booking Area Updated Successfully");
      } else {
        toast.error("Failed to update Booking Area");
      }
    } catch (error) {
      console.error("Error updating Booking Area:", error);
      toast.error("An error occurred while updating Booking Area");
    }
  };

  const deleteExistingImage = (index) => {
    const updatedExistingImages = [...addbooking.images];
    updatedExistingImages.splice(index, 1);

    // Update the state with the modified images array
    setAddBooking({
      ...addbooking,
      images: updatedExistingImages,
    });
  };

  const deleteExistingFacility = (index) => {
    if (updateMode) {
      // If in update mode, handle deletion of the facility
      const updatedExistingFacilities = [...addbooking.facilities];
      updatedExistingFacilities.splice(index, 1);

      // Update the state with the modified facilities array
      setAddBooking((prevBooking) => ({
        ...prevBooking,
        facilities: updatedExistingFacilities,
      }));

      // Also update the facilitiestags state to reflect the changes
      setFacilitiestags(updatedExistingFacilities);
    }
  };
  // handledeltebooking===================================================================>
  const handledeltebooking = async (v) => {
    const res = await axios.delete(`/api/bookingarea/${v._id}`);

    if (res.data) {
      toast.success("Booking Area Delted Successfully");
    } else {
      toast.error("Failed to Delted Booking Area");
    }
  };

  return (
    <>
      <ToastContainer />
      <h1 className=" text-center font-bold text-xl">All Bookings Areas</h1>
      <div className="max-w-md mx-auto">
        <div className="relative flex items-center w-full h-12 rounded-lg border focus-within:shadow-lg bg-white overflow-hidden">
          <div className="grid place-items-center h-full w-12 text-gray-300 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
            type="text"
            id="search"
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search something.."
          />
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-gray-200 shadow-md m-5">
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                Name
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                Status
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                Area Title
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                Type
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {bookingarea.map((v, i) => {
              return (
                <tr key={i} className="hover:bg-gray-50">
                  <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">

                   {v.owner ? <>
                    <div className="relative h-10 w-10">
                      <img
                        className="h-full w-full rounded-full object-cover object-center"
                        src={v.owner.photo}
                        alt=""
                      />
                      <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 animate-ping ring ring-white"></span>
                    </div> 
                    <div className="text-sm">
                      <div className="font-medium text-gray-700">
                      {v.owner.name}
                      </div>
                      <div className="text-gray-400">{v.owner.email}</div>
                    </div>
                   </>: <>
                   <div className="relative h-10 w-10">
                      <img
                        className="h-full w-full rounded-full object-cover object-center"
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                      <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 animate-ping ring ring-white"></span>
                    </div> 
                    <div className="text-sm">
                      <div className="font-medium text-gray-700">
                      Admin
                      </div>
                      <div className="text-gray-400">jobs@sailboatui.com</div>
                    </div>
                   </>} 
                    
                    
                  </th>
                  <td className="px-6 py-4">
                    {v?.isActive == true ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                        Unctive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">{v.title}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                        {v.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end items-center gap-4">
                      <button
                        className=" block"
                        x-data="{ tooltip: 'Delete' }"
                        onClick={() => handledeltebooking(v)}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>

                      <button className=" block" x-data="{ tooltip: 'Delete' }">
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button
                        x-data="{ tooltip: 'Edite' }"
                        onClick={() => handleUpdate(v)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        className={`flex justify-center  fixed top-0 bottom-0 left-0 right-0 z-[100] items-center w-full h-screen ${
          model == true ? "bg-[rgba(0,0,0,0.1)] -z-50 " : "pointer-events-none"
        }  `}
        onClick={() => setModel(!model)}
      ></div>
      <div
        className={`flex justify-center  fixed top-0 bottom-0 left-0 right-0 z-[100] items-center w-full h-screen ${
          model == true ? "bg-[rgba(0,0,0,0.1)] -z-50 " : "pointer-events-none"
        }  `}
      >
        <div
          className={
            model == true
              ? "bg-[#F7F7F8] h-screen w-[90%] overflow-auto absolute transition-all duration-1000  top-[0] z-50 opacity-1 "
              : "bg-[#F7F7F8] min-h-[90vh] w-[90%]  transition-all duration-1000  absolute top-[-200vh] opacity-0  pointer-events-none "
          }
        >
          <div className="flex justify-end p-4" onClick={() => setModel(false)}>
            <button className=" h-8 w-8 bg-red-600 text-white  flex justify-center items-center rounded-full text-[30px] cursor-pointer ">
              x
            </button>
          </div>
          <div className=" max-w-[1200px] border m-auto">
            <h1 className=" text-center text-[30px]">
              Register Your Booking Area
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="p-2">
                  <label htmlFor="">Title</label>
                  <input
                    type="text"
                    className=" w-full py-1 px-3"
                    placeholder="Enter Your Project Title"
                    onChange={inputhandler}
                    name="title"
                    value={addbooking.title}
                  />
                </div>
                <div className="p-2">
                  <label htmlFor="">Size </label>
                  <input
                    type="text"
                    className=" w-full py-1 px-3"
                    placeholder="Enter Your Size of Your Booing"
                    onChange={inputhandler}
                    name="size"
                    value={addbooking.size}
                  />
                </div>
                <div className="p-2">
                  <label htmlFor="">Street</label>
                  <input
                    type="text"
                    className=" w-full py-1 px-3"
                    placeholder="Enter Your Street No"
                    onChange={inputhandler}
                    name="street"
                    value={addbooking.street}
                  />
                </div>
                <div className="p-2">
                  <label htmlFor="">City</label>
                  <input
                    type="text"
                    className=" w-full py-1 px-3"
                    placeholder="Enter Your Project City"
                    onChange={inputhandler}
                    name="city"
                    value={addbooking.city}
                  />
                </div>
                <div className="p-2">
                  <label htmlFor="">State</label>
                  <input
                    type="text"
                    className=" w-full py-1 px-3"
                    placeholder="Enter Your Project State"
                    onChange={inputhandler}
                    name="state"
                    value={addbooking.state}
                  />
                </div>
                <div className="p-2">
                  <label htmlFor="">Country</label>
                  <input
                    type="text"
                    className=" w-full py-1 px-3"
                    placeholder="Enter Your Project Country"
                    onChange={inputhandler}
                    name="country"
                    value={addbooking.country}
                  />
                </div>
                <div className="p-2">
                  <label htmlFor="">Zip</label>
                  <input
                    type="text"
                    className=" w-full py-1 px-3"
                    placeholder="Enter Your Project State"
                    onChange={inputhandler}
                    name="zip"
                    value={addbooking.zip}
                  />
                </div>
                <div className="p-2">
                  <label htmlFor="">Type of Booking Area</label>
                  <input
                    type="text"
                    className=" w-full py-1 px-3"
                    placeholder="Enter Type of Booking Area i.e.Play area"
                    onChange={inputhandler}
                    name="type"
                    value={addbooking.type}
                  />
                </div>
                <div className="p-2">
                  <label htmlFor="">Type of Booking Area</label>
                  <input
                    type="text"
                    className=" w-full py-1 px-3"
                    placeholder="Enter the Price per Hour"
                    onChange={inputhandler}
                    name="pricePerHour"
                    value={addbooking.pricePerHour}
                  />
                </div>
              </div>

              <div className="bg-[#E5E5E5] p-2">
                <h2 className="text-[20px]">Opening And Closing Time</h2>
              </div>

              <div>
                {addbooking.openingHours.map((v, i) => {
                  return (
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1"
                      key={i}
                    >
                      <div className="p-2">
                        <label htmlFor="">Select Opening Day {i + 1} </label>
                        <select
                          name="day"
                          onChange={(e) => inputhandler(e, i)}
                          id=""
                          className="py-2 px-3 w-full"
                          value={addbooking.openingHours[i].day}
                        >
                          <option value="">Select Your Day</option>
                          <option value="Sunday">Sunday</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                        </select>
                      </div>
                      <div className="p-2">
                        <label htmlFor="">Enter Your Starting Time</label>
                        <input
                          onChange={(e) => inputhandler(e, i)}
                          name="startTime"
                          type="time"
                          className="w-full py-1 px-3"
                          value={addbooking.openingHours[i].startTime}
                        />
                      </div>
                      <div className="p-2">
                        <label htmlFor="">Enter Closing Time</label>
                        <input
                          onChange={(e) => inputhandler(e, i)}
                          type="time"
                          name="endTime"
                          className="w-full py-1 px-3"
                          value={addbooking.openingHours[i].endTime}
                        />
                      </div>
                    </div>
                  );
                })}

                <div className="p-2">
                  <div className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                    <span
                      onClick={addTimings}
                      className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
                    >
                      Add More Days
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <label className="FormLabelControl" htmlFor="author">
                  Add Your Facilites That You have Providing
                </label>

                <div className="input">
                  <div className="inputbox">
                    <input
                      className=" w-full py-1 px-3"
                      type="text"
                      onChange={(e) => setdata(e.target.value)}
                      value={data}
                      onKeyDown={handlekeydown}
                      placeholder="Add Facilities"
                    />
                  </div>
                </div>
                {updateMode && addbooking.facilities?.length >= 1 && (
                  <div className="p-2">
                    {addbooking.facilities.map((v, index) => (
                      <div
                        className="border inline-block p-2 rounded-sm relative m-1"
                        key={index}
                        id={index}
                      >
                        <span>{v}</span>
                        <i
                          className="fa-solid fa-x absolute right-[-5px] top-[-4px] text-[10px] text-white bg-red-600 rounded-full p-[2px] animate-pulse hover:animate-none"
                          onClick={() => deleteExistingFacility(index)}
                        ></i>
                      </div>
                    ))}
                  </div>
                )}
                {facilitiestags?.length >= 1 && (
                  <div className=" p-2">
                    {facilitiestags.map((v, i) => (
                      <div
                        className="border inline-block p-2 rounded-sm relative m-1"
                        key={i}
                        id={i}
                      >
                        <span>{v}</span>
                        <i
                          className="fa-solid fa-x absolute right-[-5px] top-[-4px] text-[10px] text-white bg-red-600 rounded-full p-[2px] animate-pulse hover:animate-none"
                          onClick={() => handleDel(i)}
                        ></i>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-[#E5E5E5] p-2">
                deleteExistingImage
                <h2 className="text-[20px]">Upload Your Pictures</h2>
              </div>
              {updateMode && addbooking.images?.length >= 1 && (
                <div className="MainImageDivTrace">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {addbooking.images.map((imageUrl, index) => (
                      <div className="relative border" key={index}>
                        <i
                          onClick={() => deleteExistingImage(index)}
                          className="fa-regular fa-trash-can absolute top-0 right-0 text-red-700"
                        ></i>
                        <img
                          src={imageUrl}
                          className="w-full h-auto object-cover"
                          alt={`Image ${index}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-2">
                {tempImgs.length ? (
                  <div className="MainImageDivTrace">
                    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
                      <>
                        {tempImgs.map((e, i) => (
                          <div className="relative border">
                            <i
                              key={e._id}
                              onClick={() => deleteImage(i)}
                              className="fa-regular fa-trash-can absolute top-0 right-0 text-red-700"
                            ></i>
                            <img
                              key={i}
                              src={e}
                              className=" w-full h-auto object-cover"
                            />
                          </div>
                        ))}
                      </>
                    </div>
                  </div>
                ) : (
                  <div className="imageTraceNewsPage">
                    <h2>Add image</h2>
                  </div>
                )}

                <div className="border p-3">
                  <div className="uplaodMain">
                    <label
                      htmlFor="input"
                      className=" cursor-pointer text-xl text-center flex justify-center"
                    >
                      Upload Image
                    </label>
                    <input
                      id="input"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <button
        onClick={() => setModel(!model)}
        type="button"
        className="text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-3xl p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 absolute right-16 bottom-16 z-[500]"
      >
        <i className="fa-solid fa-plus"></i>
      </button>
    </>
  );
};

export default index;
