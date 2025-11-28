import { useState } from "react";
import { useSelector } from "react-redux"
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik'

const Dashboard = () => {
    const group = useSelector((state) => state.group.groupName);
    const storeMembers = useSelector((state) => state.group.members);
    const [addExpenseOpen, setAddExpenseOpen] = useState(false);
    const [expense, setExpense] = useState([]);
    const [settleUp, setSettleUp] = useState([]);

    const expenseSchema = Yup.object().shape({
        title: Yup.string().required("Title is Required"),
        amount: Yup.number().required("Amount is required"),
        paidBy: Yup.string().required("Paid by is required"),
        paidFor: Yup.array()
            .of(Yup.string())
            .min(1, "Select at least one member")
            .required("Select at least one member"),
    });

    const handleSplit = (newExpense) => {
        const newSettetUp = [...settleUp];

        for (let member of newExpense.paidFor) {
            if (member === newExpense.paidBy) continue;
            let isEdited = false;
            console.log(member);
            let tempObject = { from: newExpense.paidBy, to: member, amount: newExpense.amount / newExpense.paidFor.length }
            console.log(tempObject);
            for (let ind in settleUp) {
                const index = Number(ind);
                const existing = newSettetUp[index];
                console.log();
                console.log(settleUp[index]);
                if (tempObject.from === existing.from && tempObject.to === existing.to) {
                    console.log("if called", tempObject.from, settleUp[index].from, tempObject.to, settleUp[index].to);
                    newSettetUp[index] = { ...existing, amount: existing.amount + tempObject.amount };
                    isEdited = true;
                    break;
                } else if (tempObject.from === existing.to && tempObject.to === existing.from) {
                    console.log("else if called", tempObject.from, settleUp[index].to, tempObject.to, settleUp[index].from);
                    const newAmount = existing.amount - tempObject.amount;
                    if (newAmount >= 1) {
                        newSettetUp[index] = { ...existing, amount: newAmount }
                    } else if (newAmount <= 1) {
                        newSettetUp[index] = {
                            from: tempObject.from,
                            to: tempObject.to,
                            amount: Math.abs(newAmount)
                        }
                    } else {
                        newSettetUp.slice(i, 1);
                    }
                    isEdited = true;
                    break;
                }
            }
            if (!isEdited) {
                console.log("else called", tempObject);
                newSettetUp.push(tempObject);
                console.log(settleUp);
            }
        }
        setSettleUp(newSettetUp.filter(item => item.amount > 0)); // Remove the zero amount
        console.log(settleUp);
    };

    return (
        <div>
            <div className="px-[20vw] py-10 bg-[#F6F8F6] h-screen flex flex-col gap-8">
                <h3 className="bg-white rounded-xl shadow-2xl shadow-gray-200 flex justify-center p-3 w-full">{group || "Group"}</h3>
                <div className=" rounded-xl flex justify-center flex-col items-stretch gap-1 w-full">
                    <div className="flex flex-col items-center gap-3 p-3">
                        {expense.length > 0 ? (expense.map((e, index) => (
                            <div key={index} className="flex w-full justify-between px-4 py-2 bg-white shadow-2xl shadow-gray-200 rounded-xl">
                                <div>
                                    <h6>{e.title}</h6>
                                    <p>Paid by {e.paidBy}</p>
                                </div>
                                <p className="flex justify-center items-center font-medium">₹{Number(e.amount).toFixed(2)}</p>
                            </div>
                        ))) : "no payment yet"}
                    </div>
                    <button className="mt-5 bg-green-400 full p-3 font-medium rounded-xl hover:bg-green-600 duration-150 hover:cursor-pointer" onClick={() => setAddExpenseOpen(true)}>+ Add New Expense</button>
                </div>
                <div className="flex flex-col gap-3">
                    <h5>How to settle Up</h5>
                    <div className="flex flex-col gap-2">
                        {settleUp.length > 0 ?
                            (settleUp.map((e, i) => (
                                <div key={i} className="bg-white shadow-2xl shadow-gray-200 py-2.5 px-3 rounded-xl">
                                    <span className="font-medium">
                                        {e.to}
                                    </span> will pay <span className="font-medium">
                                        {e.amount.toFixed(2)}
                                    </span> to <span className="font-medium text-green-500">
                                        {e.from}
                                    </span>
                                </div>
                            )))
                            : "No settle Up Remain"}
                    </div>
                </div>
            </div>
            {addExpenseOpen ?
                <div className="fixed top-0 h-screen flex justify-center items-center w-full bg-[#66666d77]" onClick={() => setAddExpenseOpen(false)}>
                    <div className="bg-white p-5 w-[50vw] flex flex-col gap-3 rounded-2xl" onClick={(e) => e.stopPropagation()}>
                        <h4>Add New Expense</h4>
                        <Formik initialValues={{
                            title: "",
                            amount: '',
                            paidBy: "",
                            paidFor: [],
                        }}
                            validationSchema={expenseSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                setExpense([...expense, values]);
                                handleSplit(values);
                                setTimeout(() => {
                                    alert(
                                        "Form is validated! Submitting the form..."
                                    );
                                    setSubmitting(false);
                                    setAddExpenseOpen(false);
                                }, 1000);
                                console.log(expense);
                            }}
                        >
                            <Form className="flex flex-col gap-3">
                                <div className="flex gap-3">
                                    <div className="flex flex-col w-full">
                                        <label htmlFor="title" className="font-medium">Payment Title</label>
                                        <Field name='title' type="text" placeholder="e.g. Dinner at the Wellcome Hotel" className=" rounded-[5px] py-1 shadow-xl shadow-gray-300 w-full pl-4" />
                                        <ErrorMessage
                                            component="div"
                                            name="title"
                                            className="text-red-500 text-xs mt-1 ml-1"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="amount" className="font-medium">Amount</label>
                                        <div className=" relative">
                                            <Field name="amount" type="text" placeholder="45" className="rounded-[5px] shadow-xl shadow-gray-300 py-1 pl-4" />
                                            <ErrorMessage
                                                component="div"
                                                name="amount"
                                                className="text-red-500 text-xs mt-1 ml-1"
                                            />
                                            <div className=" absolute top-1 left-1 font-medium text-gray-500">₹</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full">
                                    <label htmlFor="paidBy" className="font-medium">Paid By</label>
                                    <Field as='select' className="rounded-[5px] shadow-xl shadow-gray-300 py-1 pl-4" name='paidBy'>
                                        <option value=''>Select The Name...</option>
                                        {storeMembers.map((member, index) => (
                                            <option key={index} value={member}>{member}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage
                                        component="div"
                                        name="paidBy"
                                        className="text-red-500 text-xs mt-1 ml-1"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-medium">Involved in the Split</label>

                                    {storeMembers.map((member, idx) => (
                                        <Field name="paidFor" key={idx}>
                                            {({ field, form }) => {
                                                const isSelected = field.value.includes(member);

                                                return (
                                                    <div
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                // remove
                                                                form.setFieldValue(
                                                                    "paidFor",
                                                                    field.value.filter((m) => m !== member)
                                                                );
                                                            } else {
                                                                // add
                                                                form.setFieldValue("paidFor", [...field.value, member]);
                                                            }
                                                        }}
                                                        className={`flex items-center justify-between p-3 rounded-xl shadow-sm cursor-pointer transition
              ${isSelected ? "bg-green-50" : "bg-white hover:bg-gray-100"}`}
                                                    >
                                                        {/* Avatar + Name */}
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                                                            <span className="text-gray-700">{member}</span>
                                                        </div>

                                                        {/* Checkmark */}
                                                        {isSelected ? (
                                                            <div className="w-5 h-5 bg-green-400 rounded-md flex items-center justify-center text-white font-bold">
                                                                ✓
                                                            </div>
                                                        ) : (
                                                            <div className="w-5 h-5 border border-gray-300 rounded-md"></div>
                                                        )}
                                                    </div>
                                                );
                                            }}
                                        </Field>
                                    ))}

                                    <ErrorMessage
                                        name="paidFor"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-block mt-4 bg-green-500 p-2 font-bold rounded-xl"
                                >
                                    Submit
                                </button>
                            </Form>
                        </Formik>
                    </div>
                </div>
                : ""
            }
        </div>
    )
}

export default Dashboard
