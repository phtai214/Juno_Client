import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../style/pages/admin/ProductForm.scss";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProduct = () => {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [tags, setTags] = useState([]);
    const [flashSalePrice, setFlashSalePrice] = useState(null);
    const [productImages, setProductImages] = useState([]);
    const [productDetails, setProductDetails] = useState({
        product_code: "",
        design: "",
        material: "",
        height: "",
        colors: "",
        sizes: "",
        origin: "",
        vat_included: true,
    });
    const navigate = useNavigate();

    const [variations, setVariations] = useState([
        { size: "", color: "", imageUrl: "", quantity: 0 },
    ]);
    const apiUrl = `http://localhost:3001/api/v1/product/${id}`;

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await axios.get(apiUrl);
                const product = response.data;

                setName(product.name);
                setDescription(product.description);
                setPrice(product.price);
                setQuantity(product.quantity);
                setCategory(product.category);
                setTags(product.tags || []);

                if (product.ProductDetail) {
                    setProductDetails(product.ProductDetail);
                }

                setVariations(product.Variations || []);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
            }
        };

        fetchProductData();
    }, [apiUrl]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleTagChange = (tag) => {
        setTags((prevTags) => {
            if (prevTags.includes(tag)) {
                return prevTags.filter((t) => t !== tag);
            } else {
                return [...prevTags, tag];
            }
        });
    };

    const handleProductDetailsChange = (e) => {
        const { name, value } = e.target;
        setProductDetails((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleVariationChange = (index, key, value) => {
        const newVariations = [...variations];
        newVariations[index][key] = value;
        setVariations(newVariations);
    };

    const handleAddVariation = () => {
        setVariations([
            ...variations,
            { size: "", color: "", imageUrl: "", quantity: 0 },
        ]);
    };

    const handleRemoveVariation = (index) => {
        const newVariations = variations.filter((_, i) => i !== index);
        setVariations(newVariations);
    };

    const handleProductImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setProductImages(selectedFiles);
    };

    const handleVariationImageChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const newVariations = [...variations];
            newVariations[index].imageUrl = file;
            setVariations(newVariations);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !description || !price || !quantity || !category || !image) {
            alert("Please fill in all required fields!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("quantity", quantity);
            formData.append("category", category);
            productImages.forEach((image) => {
                formData.append("productImages", image);
            });
            if (image) {
                formData.append("image", image);
            }
            tags.forEach((tag) => {
                formData.append("tag", tag);
            });
            formData.append("productDetails[product_code]", productDetails.product_code);
            formData.append("productDetails[design]", productDetails.design);
            formData.append("productDetails[material]", productDetails.material);
            formData.append("productDetails[origin]", productDetails.origin);
            formData.append("productDetails[colors]", productDetails.colors);
            formData.append("productDetails[vat_included]", productDetails.vat_included);
            variations.forEach((variation, index) => {
                formData.append(`variations[${index}][size]`, variation.size);
                formData.append(`variations[${index}][color]`, variation.color);
                formData.append(`variations[${index}][quantity]`, variation.quantity);
                if (variation.imageUrl) {
                    formData.append(`variations[${index}][image]`, variation.imageUrl);
                }
            });

            if (tags.includes("FLASH-SALE")) {
                const flashPrice = price * 0.9;
                formData.append("flash_sale_price", flashPrice);
                setFlashSalePrice(flashPrice);
            }

            await axios.put(`http://localhost:3001/api/v1/product/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Product updated successfully!");
            navigate("/admin/products");
            console.log("check fromData >>> ", formData)
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="product-form">
            <h1>Edit Product</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Product Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>Price:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Quantity:</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Category:</label>
                    <select value={category} onChange={handleCategoryChange}>
                        <option value="">Chọn phân loại</option>
                        <option value="Túi cỡ trung">Túi cỡ trung</option>
                        <option value="Túi cỡ nhỏ">Túi cỡ nhỏ</option>
                        <option value="Túi cỡ lớn">Túi cỡ lớn</option>
                        <option value="Balo">Balo</option>
                        <option value="Ví - Clutch">Ví - Clutch</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Product Image:</label>
                    <input type="file" onChange={handleImageChange} />
                </div>

                <div className="form-group">
                    <label>Tags:</label>
                    <div>
                        {["New", "Fashion", "Golden Hour", "Autumn Knit", "Back To Cool", "FLASH-SALE"].map((tag) => (
                            <label key={tag}>
                                <input
                                    type="checkbox"
                                    checked={tags.includes(tag)}
                                    onChange={() => handleTagChange(tag)}
                                />
                                {tag}
                            </label>
                        ))}
                    </div>
                </div>

                {tags.includes("FLASH-SALE") && flashSalePrice && (
                    <div className="form-group">
                        <label>Flash Sale Price:</label>
                        <input type="text" value={flashSalePrice} readOnly />
                    </div>
                )}

                {/* Product Details */}
                <div className="form-group">
                    <label>Product Code:</label>
                    <input
                        type="text"
                        name="product_code"
                        value={productDetails.product_code}
                        onChange={handleProductDetailsChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Design:</label>
                    <select
                        name="design"
                        value={productDetails.design}
                        onChange={handleProductDetailsChange}
                        required
                    >
                        <option value="">Select Design</option>
                        <option value="Fashion Bag">Fashion Bag</option>
                        <option value="Fashion Backpack">Fashion Backpack</option>
                        <option value="Clutch">Clutch</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Material:</label>
                    <input
                        type="text"
                        name="material"
                        value={productDetails.material}
                        onChange={handleProductDetailsChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Colors:</label>
                    <input
                        type="text"
                        name="colors"
                        value={productDetails.colors}
                        onChange={handleProductDetailsChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Origin:</label>
                    <input
                        type="text"
                        name="origin"
                        value={productDetails.origin}
                        onChange={handleProductDetailsChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>VAT Included:</label>
                    <input
                        type="checkbox"
                        name="vat_included"
                        checked={productDetails.vat_included}
                        onChange={(e) =>
                            setProductDetails((prevState) => ({
                                ...prevState,
                                vat_included: e.target.checked,
                            }))
                        }
                    />
                </div>

                {/* Variations */}
                <div className="form-group">
                    <label>Product Images:</label>
                    <input type="file" multiple onChange={handleProductImageChange} />
                </div>

                {variations.map((variation, index) => (
                    <div key={index}>
                        <div className="form-group">
                            <label>Variation Size:</label>
                            <input
                                type="text"
                                value={variation.size}
                                onChange={(e) =>
                                    handleVariationChange(index, "size", e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Variation Color:</label>
                            <input
                                type="text"
                                value={variation.color}
                                onChange={(e) =>
                                    handleVariationChange(index, "color", e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Variation Quantity:</label>
                            <input
                                type="number"
                                value={variation.quantity}
                                onChange={(e) =>
                                    handleVariationChange(
                                        index,
                                        "quantity",
                                        parseInt(e.target.value)
                                    )
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Variation Image:</label>
                            <input
                                type="file"
                                onChange={(e) => handleVariationImageChange(index, e)}
                            />
                        </div>

                        {/* Remove Variation Button */}
                        <button
                            type="button"
                            onClick={() => handleRemoveVariation(index)}
                            className="btn btn-danger"
                        >
                            Remove Variation
                        </button>
                    </div>
                ))}

                {/* Add New Variation Button */}
                <button
                    type="button"
                    onClick={handleAddVariation}
                    className="btn btn-primary"
                >
                    Add New Variation
                </button>

                <button className="btn-create-product" type="submit">Update Product</button>
            </form>
        </div>
    );
};

export default UpdateProduct;