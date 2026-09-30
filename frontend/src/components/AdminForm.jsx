const AdminForm = ({
    title,
    fields,
    formData,
    setFormData,
    onSubmit,
    onCancel,
    submitText = "Save"
}) => {

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <form
            onSubmit={onSubmit}
            style={{
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                marginTop: "20px"
            }}
        >

            {title && <h2>{title}</h2>}

            {fields.map((field) => (

                <div
                    key={field.name}
                    style={{
                        marginBottom: "15px"
                    }}
                >

                    <label
                        style={{
                            display: "block",
                            marginBottom: "5px"
                        }}
                    >
                        {field.label}
                    </label>

                    {field.type === "textarea" ? (

                        <textarea
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            required={field.required !== false}
                            rows="4"
                            style={{
                                width: "100%",
                                padding: "10px",
                                boxSizing: "border-box"
                            }}
                        />

                    ) : (

                        <input
                            type={field.type || "text"}
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            required={field.required !== false}
                            style={{
                                width: "100%",
                                padding: "10px",
                                boxSizing: "border-box"
                            }}
                        />

                    )}

                </div>

            ))}

            <button
                type="submit"
                style={{
                    marginRight: "10px"
                }}
            >
                {submitText}
            </button>

            {onCancel && (
                <button
                    type="button"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            )}

        </form>
    );
};

export default AdminForm;