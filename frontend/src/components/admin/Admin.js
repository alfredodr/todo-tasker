import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import { adminValidate } from "@/utils/adminValidate";
import Link from "next/link";
import Paginate from "@/components/common/Paginate";

const Admin = ({
  users,
  pages,
  keyword,
  pageNumber,
  startRange,
  endRange,
  count,
}) => {
  const { data: session, update } = useSession();
  const [show, setShow] = useState(false);

  function UserForm({ user }) {
    const [profileMessage, setProfileMessage] = useState("");
    let options;
    let res;
    let data;
    let message;
    const formik = useFormik({
      initialValues: { ...user },
      validate: adminValidate,
      onSubmit: async (values, actions) => {
        const action = values.actions; // get the "actions" field from the form values

        switch (action) {
          case "update":
            //update profile
            options = {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.jwt}`,
              },
              body: JSON.stringify({
                _id: values._id,
                name: values.name,
                email: values.email,
                role: values.role,
              }),
            };

            res = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile`,
              options
            );

            data = await res.json();

            if (res.ok && data) {
              // triggering a session update, updated the value server-side.
              // All `useSession().data` references will be updated.
              setProfileMessage("User Updated Successfully");
            } else if (!res.ok) {
              message = data.message;
              actions.setFieldError("general", message);
            }
            break;
          case "delete":
            //update profile
            options = {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.jwt}`,
              },
            };

            res = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user._id}`,
              options
            );

            data = await res.json();

            if (res.ok && data) {
              // triggering a session update, updated the value server-side.
              // All `useSession().data` references will be updated.
              setProfileMessage("User Deleted Successfully");
            } else if (!res.ok) {
              message = data.message;
              actions.setFieldError("general", message);
            }
            break;
          default:
            // handle other actions or no action
            break;
        }
      },
    });

    return (
      <React.Fragment>
        <li className="list-none ">
          {formik?.errors?.general ? (
            <span className="text-red-700 text-sm">
              {formik.errors.general}
            </span>
          ) : (
            <></>
          )}
          {profileMessage !== "" ? (
            <span className="text-green-600 text-sm">{profileMessage}</span>
          ) : (
            <></>
          )}
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col md:flex-row space-x-0 md:space-x-5 p-5 bg-white"
          >
            <div className="w-full ">
              <label
                htmlFor="name"
                className="block text-gray-600 font-semibold mb-2 text-sm"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`border rounded-md p-2 w-full bg-slate-50 focus:outline-none ${
                  formik.errors.name && formik.touched.name
                    ? "border-red-700"
                    : null
                }`}
                required
                {...formik.getFieldProps("name")}
              />
              {formik.errors.name && formik.touched.name ? (
                <span className="text-red-700 text-sm">
                  {formik.errors.name}
                </span>
              ) : (
                <></>
              )}
            </div>
            <div className="w-full">
              <label
                htmlFor="email"
                className="block text-gray-600 font-semibold mb-2 text-sm"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`border rounded-md p-2 w-full bg-slate-50 focus:outline-none ${
                  formik.errors.email && formik.touched.email
                    ? "border-red-700"
                    : null
                }`}
                required
                {...formik.getFieldProps("email")}
              />
              {formik.errors.email && formik.touched.email ? (
                <span className="text-red-700 text-sm">
                  {formik.errors.email}
                </span>
              ) : (
                <></>
              )}
            </div>
            <div className="w-full">
              <label
                htmlFor="role"
                className="block text-gray-600 font-semibold mb-2 text-sm"
              >
                Role
              </label>
              <input
                type="text"
                id="role"
                name="role"
                className={`border rounded-md p-2 w-full bg-slate-50 focus:outline-none ${
                  formik.errors.role && formik.touched.role
                    ? "border-red-700"
                    : null
                }`}
                required
                {...formik.getFieldProps("role")}
              />
              {formik.errors.email && formik.touched.email ? (
                <span className="text-red-700 text-sm">
                  {formik.errors.role}
                </span>
              ) : (
                <></>
              )}
            </div>
            <div>
              <label htmlFor="actions" className="block">
                Actions
              </label>
              <select
                id="actions"
                name="actions"
                //   value={values.color}
                //   onChange={handleChange}
                //   onBlur={handleBlur}
                className="bg-gradient-to-r border border-blue-500 text-blue-500 text-lg py-2 px-4 rounded-md"
                {...formik.getFieldProps("actions")}
              >
                <option value="">Actions</option>
                <option value="update" label="update">
                  Update
                </option>
                <option value="delete" label="delete">
                  Delete
                </option>
              </select>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 border hover:bg-white border-blue-500 text-gray-50 text-lg py-2 px-4 rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        </li>
      </React.Fragment>
    );
  }

  return (
    <>
      <section className="flex justify-center md:h-screen bg-gray-100 p-4">
        <div className="container bg-slate-50 rounded-md drop-shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-black p-5 mb-5">
            <h1 className="text-white text-3xl font-bold mb-2 md:mb-0">
              All Users
            </h1>
            <Link href={"/register"}>
              <div className="flex flex-row items-center border border-slate-400 text-slate-400 text-lg px-2 py-1 rounded hover:border-slate-200 hover:text-slate-200 focus-within:bg-slate-800 outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="fill-white mr-2"
                >
                  <path
                    fillRule="evenodd"
                    d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"
                  ></path>
                </svg>
                <span>Add User</span>
              </div>
            </Link>
          </div>

          <ul className="flex flex-col list-disc ml-5">
            {users?.map((user, index) => (
              <UserForm user={user} key={index} />
            ))}
          </ul>
          <Paginate
            page={pageNumber}
            pages={pages}
            keyword={keyword ? keyword : ""}
          />
        </div>
      </section>
    </>
  );
};
export default Admin;