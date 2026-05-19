import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone, Star } from "lucide-react";
import { useLanguage } from "../../context/useLanguage";
import { handleAnchorClick, scrollToFeaturedStart } from "../../utils/scrollTo";

const initialFormState = {
    name: "",
    email: "",
    phone: "",
    message: "",
    company: "",
};

function ContactSection() {
    const { t } = useLanguage();

    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const nextErrors = {};

        if (!formData.name.trim()) {
            nextErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            nextErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            nextErrors.email = "Enter a valid email";
        }

        if (!formData.phone.trim()) {
            nextErrors.phone = "Phone is required";
        }

        if (!formData.message.trim()) {
            nextErrors.message = "Message is required";
        }

        return nextErrors;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentValue) => ({
            ...currentValue,
            [name]: value,
        }));

        setErrors((currentErrors) => ({
            ...currentErrors,
            [name]: "",
        }));

        setSubmitStatus(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setSubmitStatus("error");
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    message: formData.message.trim(),
                    company: formData.company.trim(),
                    pageUrl: window.location.href,
                }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);

                if (data?.errors) {
                    setErrors(data.errors);
                }

                throw new Error(data?.error || "Failed to send request");
            }

            setFormData(initialFormState);
            setErrors({});
            setSubmitStatus("success");
        } catch {
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section
            id="contact"
            className="relative bg-[#f4f1ee] px-4 py-24 text-[#2d2621] md:px-8 md:py-28"
        >
            <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[0.85fr_0.95fr_0.45fr]">
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h2 className="font-serif text-4xl md:text-6xl">
                        {t("contact.eyebrow")}
                    </h2>

                    <p className="mt-6 max-w-md text-lg leading-8 text-[#6d655d]">
                        {t("contact.description")}
                    </p>

                    <div className="mt-12 max-w-[520px] overflow-hidden rounded-[1.8rem] bg-[linear-gradient(135deg,#1b1715_0%,#3d3128_100%)] p-6 text-white shadow-[0_18px_60px_rgba(0,0,0,0.14)]">
                        <div className="flex gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#d8bd96] text-[#2b2219]">
                                <Star className="h-6 w-6" />
                            </div>

                            <div>
                                <p className="text-lg leading-8 text-white/90">
                                    {t("contact.testimonial")}
                                </p>
                                <p className="mt-5 text-sm uppercase tracking-[0.18em] text-white/55">
                                    {t("contact.client_name")}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.form
                    onSubmit={handleSubmit}
                    noValidate
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-[1.8rem] border border-black/5 bg-white p-8 shadow-[0_18px_60px_rgba(0,0,0,0.08)]"
                >
                    <h3 className="mb-6 font-serif text-4xl">
                        {t("contact.form_title")}
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <input
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder={t("contact.placeholder_name")}
                                aria-invalid={Boolean(errors.name)}
                                className={`w-full rounded-xl border bg-[#f6f2ee] px-4 py-3.5 outline-none transition focus:border-[#d8bd96] ${
                                    errors.name ? "border-red-400" : "border-[#e7ddd3]"
                                }`}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder={t("contact.placeholder_email")}
                                aria-invalid={Boolean(errors.email)}
                                className={`w-full rounded-xl border bg-[#f6f2ee] px-4 py-3.5 outline-none transition focus:border-[#d8bd96] ${
                                    errors.email ? "border-red-400" : "border-[#e7ddd3]"
                                }`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <input
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder={t("contact.placeholder_phone")}
                                aria-invalid={Boolean(errors.phone)}
                                className={`w-full rounded-xl border bg-[#f6f2ee] px-4 py-3.5 outline-none transition focus:border-[#d8bd96] ${
                                    errors.phone ? "border-red-400" : "border-[#e7ddd3]"
                                }`}
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                            )}
                        </div>

                        <input
                            name="company"
                            type="text"
                            value={formData.company}
                            onChange={handleChange}
                            tabIndex={-1}
                            autoComplete="off"
                            aria-hidden="true"
                            className="hidden"
                        />

                        <div>
                            <textarea
                                name="message"
                                rows={5}
                                value={formData.message}
                                onChange={handleChange}
                                placeholder={t("contact.placeholder_message")}
                                aria-invalid={Boolean(errors.message)}
                                className={`w-full rounded-xl border bg-[#f6f2ee] px-4 py-3.5 outline-none transition focus:border-[#d8bd96] ${
                                    errors.message ? "border-red-400" : "border-[#e7ddd3]"
                                }`}
                            />
                            {errors.message && (
                                <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                            )}
                        </div>
                    </div>

                    {submitStatus === "success" && (
                        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            Request sent successfully. We will contact you shortly.
                        </p>
                    )}

                    {submitStatus === "error" && (
                        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            Please check the form fields or try again later.
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#dcc19a] px-6 py-4 text-lg font-medium text-[#2b2219] transition hover:bg-[#e5cbab] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Sending..." : t("buttons.contact_us")}
                        {!isSubmitting && <ArrowRight className="h-4 w-4 rtl:rotate-180" />}
                    </button>
                </motion.form>

                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col justify-between"
                >
                    <div className="space-y-6 text-lg text-[#6d655d]">
                        <div className="flex items-center gap-4">
                            <Phone className="h-5 w-5 text-[#b28a58]" />
                            <span dir="ltr">+420732446983</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Phone className="h-5 w-5 text-[#b28a58]" />
                            <span dir="ltr">+420732446656</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Mail className="h-5 w-5 text-[#b28a58]" />
                            <a
                                href={`mailto:${t("contact.email")}`}
                                className="transition hover:text-[#b28a58]"
                                aria-label={`Send email to ${t("contact.email")}`}
                            >
                                {t("contact.email")}
                            </a>
                        </div>
                    </div>

                    <div className="mt-10">
                        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm uppercase tracking-[0.18em] text-[#8d857c]">
                            {[
                                { label: t("nav.home"), id: "home" },
                                { label: t("nav.about"), id: "about" },
                                { label: t("nav.services"), id: "services" },
                                { label: t("nav.featured"), id: "featured" },
                                { label: t("nav.contact"), id: "contact" },
                            ].map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (item.id === "featured") scrollToFeaturedStart();
                                        else handleAnchorClick(e, item.id);
                                    }}
                                    className="transition hover:text-[#b28a58]"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>

                        <p className="mt-10 text-sm text-[#948c84]">
                            {t("contact.footer_copy")}
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default ContactSection;