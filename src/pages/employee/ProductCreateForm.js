import React, { useState } from "react";
import axios from "axios";
import "../../style/pages/admin/ProductForm.scss";
import { useNavigate } from "react-router-dom"

const ProductCreateFormEmployee = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState([]); // Sử dụng mảng để lưu trữ các tag
  const [flashSalePrice, setFlashSalePrice] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const navigate = useNavigate();

  // Thông tin chi tiết sản phẩm
  const [productDetails, setProductDetails] = useState({
    product_code: "", // Mã sản phẩm
    design: "", // Kiểu dáng
    material: "", // Chất liệu
    height: "", // Độ cao
    colors: "", // Màu sắc
    sizes: "", // Kích cỡ
    origin: "", // Xuất xứ
    vat_included: true, // VAT đã bao gồm
  });

  // Biến thể của sản phẩm
  const [variations, setVariations] = useState([
    { size: "", color: "", imageUrl: "", quantity: 0 },
  ]);

  const apiUrl = "http://localhost:3001/api/v1/product/create"; // Thay URL API phù hợp

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
        // Nếu tag đã được chọn, bỏ chọn nó
        return prevTags.filter((t) => t !== tag);
      } else {
        // Nếu tag chưa được chọn, thêm nó vào mảng
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
  const handleDesignChange = (e) => {
    setProductDetails((prevState) => ({
      ...prevState,
      design: e.target.value,
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
      newVariations[index].imageUrl = file; // Lưu tệp thực tế
      setVariations(newVariations);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu đầu vào
    if (!name || !description || !price || !quantity || !category || !image) {
      alert("Vui lòng điền đầy đủ thông tin!");
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
        formData.append("tag", tag); // Gửi từng tag mà không sử dụng dấu []
      });
      formData.append(
        "productDetails[product_code]",
        productDetails.product_code
      );
      formData.append("productDetails[design]", productDetails.design);
      formData.append("productDetails[material]", productDetails.material);
      formData.append("productDetails[origin]", productDetails.origin);
      formData.append("productDetails[colors]", productDetails.colors);
      formData.append(
        "productDetails[vat_included]",
        productDetails.vat_included
      );
      variations.forEach((variation, index) => {
        formData.append(`variations[${index}][size]`, variation.size);
        formData.append(`variations[${index}][color]`, variation.color);
        formData.append(`variations[${index}][quantity]`, variation.quantity);
        if (variation.imageUrl) {
          // Thêm tệp hình ảnh vào FormData
          formData.append(`variations[${index}][image]`, variation.imageUrl);
        }
      });

      if (tags.includes("FLASH-SALE")) {
        const flashPrice = price * 0.9;
        formData.append("flash_sale_price", flashPrice);
        setFlashSalePrice(flashPrice);
      }

      console.log(productDetails.colors); // Xem nó có đúng là mảng không
      console.log(productDetails.sizes); // Xem nó có đúng là mảng không
      console.log(typeof productDetails.vat_included);

      await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Product created successfully!");
      navigate('/admin/products')
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="product-form">
      <h1>Create New Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên Sản Phẩm:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Mô tả:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="form-group">
          <label>Giá:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            required
          />
        </div>

        <div className="form-group">
          <label>Số lượng:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            required
          />
        </div>

        <div className="form-group">
          <label>Phân loại:</label>
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
          <label>Ảnh sản phẩm:</label>
          <input type="file" onChange={handleImageChange} />
        </div>

        <div className="form-group">
          <label>Tags:</label>
          <div>
            {["New", "Moda Feminia", "Golden Hour", "Autumn Knit", "Back To Cool", "FLASH-SALE"].map((tag) => (
              <label key={tag}>
                <input
                  type="checkbox"
                  checked={tags.includes(tag)} // Sửa để kiểm tra trong mảng tags
                  onChange={() => handleTagChange(tag)} // Xử lý thay đổi trạng thái
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
          <label>Mã sản phẩm:</label>
          <input
            type="text"
            name="product_code"
            value={productDetails.product_code}
            onChange={handleProductDetailsChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Kiểu dáng:</label>
          <select
            name="design"
            value={productDetails.design}
            onChange={handleDesignChange}
            required
          >
            <option value="">Chọn kiểu dáng</option>
            <option value="Túi xách thời trang">Túi xách thời trang</option>
            <option value="Balo thời trang">Balo thời trang</option>
            <option value="Ví cầm tay">Ví cầm tay</option>
          </select>
        </div>

        <div className="form-group">
          <label>Chất liệu:</label>
          <input
            type="text"
            name="material"
            value={productDetails.material}
            onChange={handleProductDetailsChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Màu sắc:</label>
          <input
            type="text"
            name="colors"
            value={productDetails.colors}
            onChange={handleProductDetailsChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Xuất xứ:</label>
          <input
            type="text"
            name="origin"
            value={productDetails.origin}
            onChange={handleProductDetailsChange}
            required
          />
        </div>

        <div className="form-group">
          <label>VAT:</label>
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

            {/* Nút Xóa Biến Thể */}
            <button
              type="button"
              onClick={() => handleRemoveVariation(index)}
              className="btn btn-danger"
            >
              Xóa Biến Thể
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddVariation}
          className="btn btn-primary"
        >
          Thêm Biến Thể Mới
        </button>

        <button className="btn-create-product" type="submit">Create Product</button>
      </form>
    </div>
  );
};


export default ProductCreateFormEmployee;
