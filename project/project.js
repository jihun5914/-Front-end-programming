const menuSection = document.getElementById("menu");
const cart = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");
const history = document.getElementById("history");
let totalPrice = 0;
let salesHistory = [];

// 메뉴 클릭 시 장바구니에 추가
menuSection.addEventListener("click", (e) => {
  if (e.target.closest(".menu-item")) {
    const menuItem = e.target.closest(".menu-item");
    const name = menuItem.dataset.name;
    const price = parseInt(menuItem.dataset.price);

    // 이미 장바구니에 있는지 확인
    const existingItem = cart.querySelector(`[data-name="${name}"]`);
    if (existingItem) {
      const quantityElement = existingItem.querySelector(".quantity");
      quantityElement.value = parseInt(quantityElement.value) + 1;
      updateCartItem(existingItem, price);
    } else {
      addCartItem(name, price);
    }

    updateTotal();
  }
});

function addCartItem(name, price) {
  const cartItem = document.createElement("div");
  cartItem.classList.add("cart-item");
  cartItem.setAttribute("data-name", name);
  cartItem.innerHTML = `
    <p>${name}</p>
    <input type="number" class="quantity" value="1" min="1">
    <span class="subtotal">${price}원</span>
    <button class="remove-item">X</button>
  `;
  cart.appendChild(cartItem);

  // 수량 변경 이벤트
  cartItem.querySelector(".quantity").addEventListener("input", (e) => {
    updateCartItem(cartItem, price);
  });

  // 아이템 삭제 이벤트
  cartItem.querySelector(".remove-item").addEventListener("click", () => {
    removeCartItem(cartItem);
  });
}

function updateCartItem(cartItem, pricePerItem) {
  const quantity = cartItem.querySelector(".quantity").value;
  const subtotalElement = cartItem.querySelector(".subtotal");
  const subtotal = pricePerItem * quantity;
  subtotalElement.textContent = `${subtotal}원`;
  updateTotal();
}

function removeCartItem(cartItem) {
  cartItem.remove();
  updateTotal();
}

function updateTotal() {
  const subtotals = document.querySelectorAll(".subtotal");
  totalPrice = Array.from(subtotals).reduce((total, subtotal) => {
    return total + parseInt(subtotal.textContent);
  }, 0);
  totalPriceElement.textContent = totalPrice;
}

// 결제 버튼
document.getElementById("checkout").addEventListener("click", () => {
  alert(`총 결제 금액: ${totalPrice}원`);
  salesHistory.push(`결제: ${totalPrice}원`);
  updateHistory();
  resetCart();
});

function resetCart() {
  cart.innerHTML = "";
  totalPrice = 0;
  totalPriceElement.textContent = totalPrice;
}

function updateHistory() {
  history.innerHTML = salesHistory.map((entry) => `<p>${entry}</p>`).join("");
}

// 판매 내역 초기화
document.getElementById("reset-history").addEventListener("click", () => {
  salesHistory = [];
  history.innerHTML = "";
});

// 관리자 메뉴 추가/삭제
document.getElementById("add-menu").addEventListener("click", () => {
  const name = prompt("추가할 메뉴 이름:");
  const price = prompt("추가할 메뉴 가격:");
  if (name && price) {
    const newMenuItem = document.createElement("div");
    newMenuItem.classList.add("menu-item");
    newMenuItem.setAttribute("data-name", name);
    newMenuItem.setAttribute("data-price", price);
    newMenuItem.innerHTML = `
      <img src="./placeholder.jpg" alt="${name}">
      <p>${name} - ${price}원</p>
    `;
    menuSection.querySelector(".menu-list").appendChild(newMenuItem);
  }
});

document.getElementById("delete-menu").addEventListener("click", () => {
  const name = prompt("삭제할 메뉴 이름:");
  const menuItems = menuSection.querySelectorAll(".menu-item");
  menuItems.forEach((item) => {
    if (item.dataset.name === name) {
      item.remove();
    }
  });
});
