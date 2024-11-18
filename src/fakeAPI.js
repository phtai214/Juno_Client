const fakeData = [
  // Giày Xăng Đan
  ...Array(10)
    .fill(null)
    .map((_, idx) => ({
      name: `Giày Xăng Đan ${idx + 1}`,
      description: `Giày Xăng Đan thoáng mát, phù hợp với mùa hè. Mẫu số ${
        idx + 1
      }`,
      price: 300000 + idx * 10000,
      quantity: 100,
      category: "Giày Xăng Đan",
      variations: [
        {
          size: "36",
          color: "Đen",
          imageUrl: `https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729504578/kem_sd03070_2_20240827175705_144e6d1581a84d82830273ee6727e483_master_bhllpc.jpg`,
          quantity: 50,
        },
        {
          size: "37",
          color: "Trắng",
          imageUrl: `https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729506737/kem_sd03070_3_20240820164939_2621438d2bac4e75854cf175bb6e1451_master_k8iabz.jpg`,
          quantity: 50,
        },
        {
          size: "38",
          color: "Be",
          imageUrl: `https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729506737/kem_sd03070_3_20240820164939_2621438d2bac4e75854cf175bb6e1451_master_k8iabz.jpg`,
          quantity: 50,
        },
      ],
    })),

  // Giày Cao Gót
  ...Array(10)
    .fill(null)
    .map((_, idx) => ({
      name: `Giày Cao Gót ${idx + 1}`,
      description: `Giày Cao Gót sang trọng, thoải mái. Mẫu số ${idx + 1}`,
      price: 500000 + idx * 15000,
      quantity: 80,
      category: "Giày Cao Gót",
      variations: [
        {
          size: "35",
          color: "Đỏ",
          imageUrl: `https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729504578/kem_sd03070_2_20240827175705_144e6d1581a84d82830273ee6727e483_master_bhllpc.jpg`,
          quantity: 40,
        },
        {
          size: "37",
          color: "Đen",
          imageUrl: `https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729506737/kem_sd03070_4_20240820164939_0b4a16ab79334aa4bd595756b1c31f6c_master_ma5tix.jpg`,
          quantity: 40,
        },
        {
          size: "38",
          color: "Be",
          imageUrl: `https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729506737/kem_sd03070_3_20240820164939_2621438d2bac4e75854cf175bb6e1451_master_k8iabz.jpg`,
          quantity: 50,
        },
      ],
    })),

  // Giày Sneakers
  ...Array(10)
    .fill(null)
    .map((_, idx) => ({
      name: `Giày Sneakers ${idx + 1}`,
      description: `Giày Sneakers phong cách trẻ trung, năng động. Mẫu số ${
        idx + 1
      }`,
      price: 800000 + idx * 20000,
      quantity: 120,
      category: "Giày Sneakers",
      variations: [
        {
          size: "39",
          color: "Xanh",
          imageUrl: `https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729506651/kem_sd03070_2_20240820164939_e1b26c5419d7426a8dc2825cfd87e91a_master_xbzrbp.jpg`,
          quantity: 60,
        },
        {
          size: "41",
          color: "Trắng",
          imageUrl: `https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729506651/kem_sd03070_3_20240827175705_ca8a3dc8af8b41099e180aa3763ec3e8_master_byohug.jpg`,
          quantity: 60,
        },
        {
          size: "38",
          color: "Be",
          imageUrl: `https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729506737/kem_sd03070_3_20240820164939_2621438d2bac4e75854cf175bb6e1451_master_k8iabz.jpg`,
          quantity: 50,
        },
      ],
    })),

  // Giày Búp Bê
  ...Array(10)
    .fill(null)
    .map((_, idx) => ({
      name: `Giày Búp Bê ${idx + 1}`,
      description: `Giày Búp Bê nhẹ nhàng, nữ tính. Mẫu số ${idx + 1}`,
      price: 400000 + idx * 12000,
      quantity: 90,
      category: "Giày Búp Bê",
      variations: [
        {
          size: "36",
          color: "Hồng",
          imageUrl: `https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729507361/juno-project/kem_sd03070_3_20240820164939_2621438d2bac4e75854cf175bb6e1451_master_an2aol.jpg`,
          quantity: 45,
        },
        {
          size: "37",
          color: "Xanh",
          imageUrl: `https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729507361/juno-project/kem_sd03070_2_20240820164939_e1b26c5419d7426a8dc2825cfd87e91a_master_eot3gd.jpg`,
          quantity: 45,
        },
        {
          size: "38",
          color: "Be",
          imageUrl: `https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729506737/kem_sd03070_3_20240820164939_2621438d2bac4e75854cf175bb6e1451_master_k8iabz.jpg`,
          quantity: 50,
        },
      ],
    })),

  // Dép Guốc
  ...Array(10)
    .fill(null)
    .map((_, idx) => ({
      name: `Dép Guốc ${idx + 1}`,
      description: `Dép Guốc đơn giản nhưng tinh tế. Mẫu số ${idx + 1}`,
      price: 350000 + idx * 9000,
      quantity: 70,
      category: "Dép Guốc",
      variations: [
        {
          size: "36",
          color: "Nâu",
          imageUrl: `https://example.com/depguoc-${idx + 1}-brown.jpg`,
          quantity: 35,
        },
        {
          size: "38",
          color: "Đen",
          imageUrl: `https://example.com/depguoc-${idx + 1}-black.jpg`,
          quantity: 35,
        },
      ],
    })),

  // Túi cỡ nhỏ
  ...Array(10)
    .fill(null)
    .map((_, idx) => ({
      name: `Túi cỡ nhỏ ${idx + 1}`,
      description: `Túi cỡ nhỏ thời trang. Mẫu số ${idx + 1}`,
      price: 250000 + idx * 7000,
      quantity: 150,
      category: "Túi cỡ nhỏ",
      variations: [
        {
          color: "Đỏ",
          imageUrl: `https://example.com/tuinhỏ-${idx + 1}-red.jpg`,
          quantity: 75,
        },
        {
          color: "Xanh",
          imageUrl: `https://example.com/tuinhỏ-${idx + 1}-blue.jpg`,
          quantity: 75,
        },
      ],
    })),

  // Túi cỡ trung
  ...Array(10)
    .fill(null)
    .map((_, idx) => ({
      name: `Túi cỡ trung ${idx + 1}`,
      description: `Túi cỡ trung tiện dụng. Mẫu số ${idx + 1}`,
      price: 350000 + idx * 8000,
      quantity: 110,
      category: "Túi cỡ trung",
      variations: [
        {
          color: "Trắng",
          imageUrl: `https://example.com/tuitrung-${idx + 1}-white.jpg`,
          quantity: 55,
        },
        {
          color: "Đen",
          imageUrl: `https://example.com/tuitrung-${idx + 1}-black.jpg`,
          quantity: 55,
        },
      ],
    })),

  // Túi cỡ lớn
  ...Array(10)
    .fill(null)
    .map((_, idx) => ({
      name: `Túi cỡ lớn ${idx + 1}`,
      description: `Túi cỡ lớn rộng rãi. Mẫu số ${idx + 1}`,
      price: 450000 + idx * 10000,
      quantity: 90,
      category: "Túi cỡ lớn",
      variations: [
        {
          color: "Đen",
          imageUrl: `https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729507361/juno-project/kem_sd03070_2_20240820164939_e1b26c5419d7426a8dc2825cfd87e91a_master_eot3gd.jpg`,
          quantity: 45,
        },
        {
          color: "Xám",
          imageUrl: `https://example.com/tuill-${idx + 1}-gray.jpg`,
          quantity: 45,
        },
      ],
    })),

  // Balo
  ...Array(10)
    .fill(null)
    .map((_, idx) => ({
      name: `Balo ${idx + 1}`,
      description: `Balo tiện lợi cho mọi hoạt động. Mẫu số ${idx + 1}`,
      price: 500000 + idx * 12000,
      quantity: 80,
      category: "Balo",
      variations: [
        {
          color: "Xanh",
          imageUrl: `https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729507361/juno-project/kem_sd03070_3_20240820164939_2621438d2bac4e75854cf175bb6e1451_master_an2aol.jpg`,
          quantity: 40,
        },
        {
          color: "Đen",
          imageUrl: `https://example.com/balo-${idx + 1}-black.jpg`,
          quantity: 40,
        },
      ],
    })),

  // Ví
  ...Array(10)
    .fill(null)
    .map((_, idx) => ({
      name: `Ví  ${idx + 1}`,
      description: `Ví  sành điệu cho phái nữ. Mẫu số ${idx + 1}`,
      price: 200000 + idx * 8000,
      quantity: 150,
      category: "Ví ",
      variations: [
        {
          color: "Vàng",
          imageUrl: `https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729507361/juno-project/kem_sd03070_3_20240820164939_2621438d2bac4e75854cf175bb6e1451_master_an2aol.jpg`,
          quantity: 75,
        },
        {
          color: "Trắng",
          imageUrl: `https://example.com/clutch-${idx + 1}-white.jpg`,
          quantity: 75,
        },
      ],
    })),

  // Mắt kính
  ...Array(10)
    .fill(null)
    .map((_, idx) => ({
      name: `Mắt kính ${idx + 1}`,
      description: `Mắt kính phong cách. Mẫu số ${idx + 1}`,
      price: 300000 + idx * 6000,
      quantity: 130,
      category: "Mắt kính",
      variations: [
        {
          color: "Đen",
          imageUrl: `https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729507361/juno-project/kem_sd03070_2_20240820164939_e1b26c5419d7426a8dc2825cfd87e91a_master_eot3gd.jpg`,
          quantity: 65,
        },
        {
          color: "Xanh",
          imageUrl: `https://example.com/matkinh-${idx + 1}-blue.jpg`,
          quantity: 65,
        },
      ],
    })),

  // Vớ
  ...Array(10)
    .fill(null)
    .map((_, idx) => ({
      name: `Vớ ${idx + 1}`,
      description: `Vớ chất lượng cao. Mẫu số ${idx + 1}`,
      price: 50000 + idx * 1000,
      quantity: 200,
      category: "Vớ",
      variations: [
        {
          size: "Free Size",
          color: "Trắng",
          imageUrl: `https://res.cloudinary.com/dhjrrk4pg/image/upload/v1729507361/juno-project/kem_sd03070_2_20240820164939_e1b26c5419d7426a8dc2825cfd87e91a_master_eot3gd.jpg`,
          quantity: 100,
        },
        {
          size: "Free Size",
          color: "Đen",
          imageUrl: `https://example.com/vo-${idx + 1}-black.jpg`,
          quantity: 100,
        },
      ],
    })),

  // Đầm & Jumpsuit
  ...Array(10)
    .fill(null)
    .map((_, idx) => ({
      name: `Đầm & Jumpsuit ${idx + 1}`,
      description: `Đầm & Jumpsuit thanh lịch. Mẫu số ${idx + 1}`,
      price: 600000 + idx * 15000,
      quantity: 70,
      category: "Đầm & Jumpsuit",
      variations: [
        {
          size: "S",
          color: "Đỏ",
          imageUrl: `https://example.com/dam-${idx + 1}-red.jpg`,
          quantity: 35,
        },
        {
          size: "M",
          color: "Xanh",
          imageUrl: `https://example.com/dam-${idx + 1}-blue.jpg`,
          quantity: 35,
        },
      ],
    })),

  // Áo
  ...Array(10)
    .fill(null)
    .map((_, idx) => ({
      name: `Áo ${idx + 1}`,
      description: `Áo thời trang, phong cách. Mẫu số ${idx + 1}`,
      price: 300000 + idx * 7000,
      quantity: 120,
      category: "Áo",
      variations: [
        {
          size: "S",
          color: "Trắng",
          imageUrl: `https://example.com/ao-${idx + 1}-white.jpg`,
          quantity: 60,
        },
        {
          size: "L",
          color: "Đen",
          imageUrl: `https://example.com/ao-${idx + 1}-black.jpg`,
          quantity: 60,
        },
      ],
    })),

  // Quần
  ...Array(10)
    .fill(null)
    .map((_, idx) => ({
      name: `Quần ${idx + 1}`,
      description: `Quần phong cách hiện đại. Mẫu số ${idx + 1}`,
      price: 400000 + idx * 8000,
      quantity: 110,
      category: "Quần",
      variations: [
        {
          size: "M",
          color: "Xám",
          imageUrl: `https://example.com/quan-${idx + 1}-gray.jpg`,
          quantity: 55,
        },
        {
          size: "L",
          color: "Đen",
          imageUrl: `https://example.com/quan-${idx + 1}-black.jpg`,
          quantity: 55,
        },
      ],
    })),

  // Váy
  ...Array(10)
    .fill(null)
    .map((_, idx) => ({
      name: `Váy ${idx + 1}`,
      description: `Váy điệu đà, nữ tính. Mẫu số ${idx + 1}`,
      price: 500000 + idx * 10000,
      quantity: 80,
      category: "Váy",
      variations: [
        {
          size: "S",
          color: "Đỏ",
          imageUrl: `https://example.com/vay-${idx + 1}-red.jpg`,
          quantity: 40,
        },
        {
          size: "M",
          color: "Hồng",
          imageUrl: `https://example.com/vay-${idx + 1}-pink.jpg`,
          quantity: 40,
        },
      ],
    })),

  // Khoác
  ...Array(10)
    .fill(null)
    .map((_, idx) => ({
      name: `Áo Khoác ${idx + 1}`,
      description: `Áo Khoác giữ ấm thời trang. Mẫu số ${idx + 1}`,
      price: 700000 + idx * 15000,
      quantity: 60,
      category: "Khoác",
      variations: [
        {
          size: "M",
          color: "Xám",
          imageUrl: `https://example.com/khoac-${idx + 1}-gray.jpg`,
          quantity: 30,
        },
        {
          size: "L",
          color: "Đen",
          imageUrl: `https://example.com/khoac-${idx + 1}-black.jpg`,
          quantity: 30,
        },
      ],
    })),
];

export default fakeData;
