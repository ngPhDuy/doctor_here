import React, { useReducer } from "react";
import TextInput from "../Input/TextInput";
import SelectInput from "../Input/SelectInput";

type AddDoctorModalProps = {
  isOpen: boolean;
  setIsOpen: () => void;
};

const initialState = {
  username: "",
  email: "",
  password: "",
  fullName: "",
  birthday: "",
  beginworkday: "",
  gender: "",
  phoneNumber: "",
  address: "",
  degree: "",
  description: "",
};

type Action =
  | { type: "SET_FIELD"; field: string; value: string }
  | { type: "RESET" };

const reducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const AddDoctorModal: React.FC<AddDoctorModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      dispatch({ type: "SET_FIELD", field, value: e.target.value });
    };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-75">
      <div className="w-full mt-auto sm:mt-20 max-w-4xl p-4 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between pb-4 mb-4 border-b rounded-t">
          <h3 className="text-lg font-semibold">Thêm bác sĩ</h3>
          <button
            type="button"
            onClick={setIsOpen}
            className="text-gray-400 hover:bg-gray-200 rounded-lg p-1.5"
          >
            ✖
          </button>
        </div>
        <div className="grid gap-4 mb-4 sm:grid-cols-2">
          <TextInput
            label="Email"
            id="email"
            value={state.email}
            onChange={handleChange("email")}
          />
          <TextInput
            label="Mật khẩu"
            id="password"
            type="password"
            value={state.password}
            onChange={handleChange("password")}
          />
          <TextInput
            label="Tên đăng nhập"
            id="username"
            value={state.username}
            onChange={handleChange("username")}
          />
          <TextInput
            label="SĐT"
            id="phoneNumber"
            value={state.phoneNumber}
            onChange={handleChange("phoneNumber")}
          />
          <TextInput
            label="Họ và tên"
            id="fullName"
            value={state.fullName}
            onChange={handleChange("fullName")}
          />
          <TextInput
            label="Ngày sinh"
            id="birthday"
            type="date"
            value={state.birthday}
            onChange={handleChange("birthday")}
          />
          <SelectInput
            label="Giới tính"
            id="gender"
            value={state.gender}
            onChange={handleChange("gender")}
            options={[
              { value: "Male", label: "Nam" },
              { value: "Female", label: "Nữ" },
              { value: "None", label: "Khác" },
            ]}
          />
          <TextInput
            label="Thời điểm vào nghề"
            id="beginworkday"
            type="date"
            value={state.beginworkday}
            onChange={handleChange("beginworkday")}
          />
          <TextInput
            label="Địa chỉ phòng khám"
            id="address"
            value={state.address}
            onChange={handleChange("address")}
          />
          <TextInput
            label="Học vấn"
            id="degree"
            value={state.degree}
            onChange={handleChange("degree")}
          />
        </div>
        <div className="grid gap-4 mb-4">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Mô tả
          </label>
          <textarea
            id="description"
            value={state.description}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "description",
                value: e.target.value,
              })
            }
            className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => {
              dispatch({ type: "RESET" });
              setIsOpen();
            }}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-800 rounded-lg"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDoctorModal;
