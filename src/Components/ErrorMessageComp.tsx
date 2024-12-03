import { ErrorMessage } from "formik";

export default function ErrorMessageComp({name}:{name:string}) {
  return (
    <div className="my-2">
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
}
