import { TextField } from "@mui/material";
import FlexEvenlyColumn from "../../Components/FlexEvenlyColumn";
import PropTypes from "prop-types";

const FormFields = ({ onChangehandle, values, isRegister, isLogin }) => {
  return (
    <>
      <FlexEvenlyColumn>
        {isRegister && (
          <>
            <TextField
              variant="standard"
              required
              label="Studio Name"
              onChange={(e) => onChangehandle(e.target.value, "studioName")}
              value={values.studioName}
              sx={{ width: "100%" }}
            />
            <TextField
              variant="standard"
              required
              label="User Name"
              onChange={(e) => onChangehandle(e.target.value, "userName")}
              value={values.userName}
              sx={{ width: "100%" }}
            />
          </>
        )}
        <TextField
          variant="standard"
          required
          type={isRegister ? "email" : "text"}
          label={isLogin ? "Username" : "Email"}
          onChange={(e) =>
            isLogin
              ? onChangehandle(e.target.value, "userName")
              : onChangehandle(e.target.value, "email")
          }
          value={values.email}
          sx={{ width: "100%" }}
        />
        {isLogin && (
          <TextField
            variant="standard"
            required
            type={"password"}
            label={"password"}
            onChange={(e) => onChangehandle(e.target.value, "password")}
            value={values.password}
            sx={{ width: "100%" }}
          />
        )}
        {isRegister && (
          <>
            <TextField
              variant="standard"
              required
              label="Phone"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
              }}            
              onChange={(e) => onChangehandle(e.target.value, "contactDetails")}
              value={values.contactDetails}
              sx={{ width: "100%" }}
              slotProps={{
                htmlInput: {
                  maxLength: 10, 
                },
                input: {
                  pattern: "[0-9]*",
                  inputMode: "numeric",  
                }
              }}
            />
            <TextField
              variant="standard"
              required
              label="City"
              onChange={(e) => onChangehandle(e.target.value, "location")}
              value={values.location}
              sx={{ width: "100%" }}
            />
            <TextField
              variant="standard"
              required
              label="Address"
              onChange={(e) => onChangehandle(e.target.value, "address")}
              value={values.address}
              sx={{ width: "100%" }}
            />
            <TextField
              variant="standard"
              required
              label="State"
              onChange={(e) => onChangehandle(e.target.value, "state")}
              value={values.state}
              sx={{ width: "100%" }}
            />
            <TextField
              variant="standard"
              required
              label="Pincode"
              onChange={(e) => onChangehandle(e.target.value, "pincode")}
              value={values.pincode}
              sx={{ width: "100%" }}
              slotProps={{
                htmlInput: {
                  maxLength: 6, 
                },
              }}
            />
          </>
        )}
      </FlexEvenlyColumn>
    </>
  );
};

FormFields.propTypes = {
  onChangehandle: PropTypes.func.isRequired,
  values: PropTypes.shape({
    studioName: PropTypes.string,
    userName: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    contactDetails: PropTypes.string,
    location: PropTypes.string,
    address: PropTypes.string,
    state: PropTypes.string,
    pincode: PropTypes.string,
  }).isRequired,
  isRegister: PropTypes.bool.isRequired,
  isLogin: PropTypes.bool.isRequired,
};

export default FormFields;
