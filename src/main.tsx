import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Bell,
  Check,
  ChevronDown,
  CircleUserRound,
  Clock3,
  Hash,
  Inbox,
  LayoutDashboard,
  MessageCircle,
  MoreHorizontal,
  Package,
  PanelRight,
  Search,
  Send,
  Settings,
  ShoppingBag,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import "./styles.css";

type OrderContext = {
  orderId: string | null;
  productName?: string;
  brand?: string;
  status?: string;
};

type ViewMode = "admin" | "customer";

const customer = {
  name: "김주희",
  email: "jkrakisis@gmail.com",
  phone: "+82 10-9105-8897",
};

const orders: OrderContext[] = [
  { orderId: "#2840", productName: "의자", brand: "매크로대표", status: "결제완료" },
  { orderId: "#2831", productName: "테이블", brand: "매크로대표", status: "배송중" },
  { orderId: null },
];

function App() {
  const [view, setView] = useState<ViewMode>("admin");
  const [context, setContext] = useState<OrderContext>(orders[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="app-shell">
      <header className="prototype-header">
        <div>
          <p className="eyebrow">UX Hypothesis Prototype</p>
          <h1>상담 컨텍스트 카드 + 고객 상담창 연동</h1>
        </div>
        <div className="view-tabs" role="tablist" aria-label="화면 전환">
          <button className={view === "admin" ? "active" : ""} onClick={() => setView("admin")}>
            관리자 상담 화면
          </button>
          <button className={view === "customer" ? "active" : ""} onClick={() => setView("customer")}>
            고객 상담창 화면
          </button>
        </div>
      </header>

      {view === "admin" ? (
        <AdminPrototype context={context} onEdit={() => setIsModalOpen(true)} />
      ) : (
        <CustomerWidgetPrototype context={context} onEdit={() => setIsModalOpen(true)} />
      )}

      {isModalOpen && (
        <OrderSelectModal
          selectedContext={context}
          onCancel={() => setIsModalOpen(false)}
          onApply={(nextContext) => {
            setContext(nextContext);
            setIsModalOpen(false);
          }}
        />
      )}
    </main>
  );
}

function AdminPrototype({ context, onEdit }: { context: OrderContext; onEdit: () => void }) {
  return (
    <section className="admin-frame" aria-label="관리자 상담 화면">
      <div className="notice-bar">
        <Sparkles size={16} />
        채널톡 관리자 화면에서 고객 문의 맥락이 자동으로 전달되는 상태를 확인하세요.
      </div>
      <div className="admin-workspace">
        <AdminSidebar />
        <InboxList />
        <AdminChatPanel context={context} onEdit={onEdit} />
        <CustomerInfoPanel />
      </div>
    </section>
  );
}

function AdminSidebar() {
  const items = [
    { icon: LayoutDashboard, label: "홈" },
    { icon: Inbox, label: "수신함", active: true },
    { icon: Users, label: "고객" },
    { icon: Bell, label: "알림" },
    { icon: Settings, label: "설정" },
  ];

  return (
    <aside className="global-sidebar">
      <div className="brand-mark">C</div>
      <nav>
        {items.map(({ icon: Icon, label, active }) => (
          <button key={label} className={active ? "active" : ""} title={label} aria-label={label}>
            <Icon size={20} />
          </button>
        ))}
      </nav>
    </aside>
  );
}

function InboxList() {
  return (
    <aside className="inbox-column">
      <div className="inbox-head">
        <h2>수신함</h2>
        <button><ChevronDown size={16} /> 전체</button>
      </div>
      <div className="filter-stack">
        <button className="active"><Hash size={15} /> 내 담당 12</button>
        <button><MessageCircle size={15} /> 미배정 4</button>
        <button><Clock3 size={15} /> 대기중 8</button>
      </div>
      <div className="conversation-list">
        {["김주희", "박서준", "오하린", "이도윤"].map((name, index) => (
          <article key={name} className={index === 0 ? "conversation active" : "conversation"}>
            <div className="avatar">{name.slice(0, 1)}</div>
            <div>
              <strong>{name}</strong>
              <p>{index === 0 ? "의자는 매크로대표 거예요..." : "주문 확인 부탁드려요"}</p>
            </div>
            <span>{index === 0 ? "방금" : `${index + 2}분`}</span>
          </article>
        ))}
      </div>
    </aside>
  );
}

function AdminChatPanel({ context, onEdit }: { context: OrderContext; onEdit: () => void }) {
  return (
    <section className="admin-chat-panel">
      <header className="chat-header">
        <div className="chat-title">
          <div className="avatar large">김</div>
          <div>
            <h2>김주희</h2>
            <p>활성 대화 · 쇼핑몰 주문 문의</p>
          </div>
        </div>
        <div className="header-actions">
          <button title="즐겨찾기"><Star size={18} /></button>
          <button title="검색"><Search size={18} /></button>
          <button title="패널"><PanelRight size={18} /></button>
          <button title="더보기"><MoreHorizontal size={18} /></button>
        </div>
      </header>
      <div className="admin-messages">
        <time>오늘 오후 2:28</time>
        <MessageBubble align="right" text="의자는 매크로대표 거예요. 감사합니다." />
        <ContextCard variant="admin" context={context} onEdit={onEdit} />
        <MessageBubble
          align="left"
          bot
          text="채팅 상담 경험을 완료했어요! 튜토리얼을 마저 진행해볼까요?"
        />
        <MessageBubble align="left" bot text="주문 맥락을 확인한 뒤 답변을 시작할 수 있어요." />
      </div>
      <footer className="message-composer">
        <input aria-label="메시지 입력" placeholder="메시지를 입력하세요" />
        <button><Send size={17} /> 전송</button>
      </footer>
    </section>
  );
}

function CustomerInfoPanel() {
  return (
    <aside className="customer-panel">
      <div className="profile-card">
        <div className="avatar xlarge">김</div>
        <h2>{customer.name}</h2>
        <p>최근 접속: 방금 전</p>
      </div>
      <dl>
        <div><dt>이메일</dt><dd>{customer.email}</dd></div>
        <div><dt>휴대폰</dt><dd>{customer.phone}</dd></div>
        <div><dt>태그</dt><dd>VIP · 주문 문의</dd></div>
        <div><dt>최근 주문</dt><dd>#2840 · 결제완료</dd></div>
      </dl>
    </aside>
  );
}

function CustomerWidgetPrototype({ context, onEdit }: { context: OrderContext; onEdit: () => void }) {
  return (
    <section className="shop-scene" aria-label="고객 상담창 화면">
      <ShopBackground />
      <CustomerChatWidget context={context} onEdit={onEdit} />
      <button className="floating-close" aria-label="상담창 닫기"><X size={24} /></button>
    </section>
  );
}

function ShopBackground() {
  const products = ["오피스 체어", "월넛 테이블", "스틸 램프", "패브릭 소파", "수납 선반", "라운지 체어"];
  return (
    <div className="shop-background">
      <header>
        <strong>Macro Market</strong>
        <nav><span>Shop</span><span>Orders</span><span>Support</span></nav>
      </header>
      <section className="shop-hero">
        <p>Spring workspace collection</p>
        <h2>일하는 공간을 더 편하게.</h2>
      </section>
      <div className="product-grid">
        {products.map((item, index) => (
          <article key={item} className="product-card">
            <div className={`product-image tone-${index}`} />
            <strong>{item}</strong>
            <span>{index % 2 === 0 ? "매크로대표" : "Studio Line"}</span>
          </article>
        ))}
      </div>
    </div>
  );
}

function CustomerChatWidget({ context, onEdit }: { context: OrderContext; onEdit: () => void }) {
  return (
    <aside className="customer-widget">
      <header className="widget-header">
        <div>
          <h2>{customer.name}</h2>
          <p>몇 분 내 답변 받을 수 있어요</p>
        </div>
        <button aria-label="더보기"><MoreHorizontal size={20} /></button>
      </header>
      <div className="widget-body">
        <div className="contact-card">
          <CircleUserRound size={20} />
          <div>
            <strong>연락처가 저장되어 있어요</strong>
            <p>오프라인 상태가 되면 문자 및 이메일로 알림을 보내드려요.</p>
          </div>
          <Check size={18} />
        </div>
        <ContextCard variant="customer" context={context} onEdit={onEdit} />
        <MessageBubble
          align="left"
          bot
          text="연락처를 남겨주시면 오프라인 상태가 되면 문자 및 이메일로 답변 알림을 보내드려요."
        />
        <MessageBubble align="right" text="의자는 매크로대표 거예요. 감사합니다." />
        <MessageBubble align="left" bot text="상담원이 주문 정보를 함께 확인하고 답변을 준비하고 있어요." />
      </div>
      <footer className="widget-input">
        <input aria-label="고객 메시지 입력" placeholder="메시지를 입력해주세요." />
        <button aria-label="보내기"><Send size={18} /></button>
      </footer>
    </aside>
  );
}

function ContextCard({
  context,
  onEdit,
  variant,
}: {
  context: OrderContext;
  onEdit: () => void;
  variant: "admin" | "customer";
}) {
  const hasOrder = Boolean(context.orderId);
  const title = hasOrder
    ? `주문 ${context.orderId}이 함께 전달됩니다`
    : "주문 정보 없이 문의합니다";

  return (
    <article className={`context-card ${variant}`}>
      <div className="context-icon"><ShoppingBag size={18} /></div>
      <div className="context-copy">
        {variant === "admin" && <span className="context-label">문의 컨텍스트</span>}
        <div className="context-title">
          <strong>{title}</strong>
          <button onClick={onEdit}>수정</button>
        </div>
        {hasOrder ? (
          <p>{context.productName} / {context.brand} / 주문 상태: {context.status}</p>
        ) : (
          <p>상담원이 주문 정보 없이 문의 내용을 확인합니다.</p>
        )}
        {variant === "customer" && hasOrder && <p>상담원이 주문 정보를 함께 확인할 수 있어요.</p>}
      </div>
    </article>
  );
}

function MessageBubble({ text, align, bot = false }: { text: string; align: "left" | "right"; bot?: boolean }) {
  return (
    <div className={`message-row ${align}`}>
      {bot && <div className="bot-dot">C</div>}
      <p className={bot ? "bubble bot" : "bubble customer"}>{text}</p>
    </div>
  );
}

function OrderSelectModal({
  selectedContext,
  onCancel,
  onApply,
}: {
  selectedContext: OrderContext;
  onCancel: () => void;
  onApply: (context: OrderContext) => void;
}) {
  const [draft, setDraft] = useState<OrderContext>(selectedContext);
  const selectedKey = useMemo(() => draft.orderId ?? "none", [draft]);

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="order-modal" role="dialog" aria-modal="true" aria-labelledby="order-modal-title">
        <header>
          <div className="context-icon"><Package size={20} /></div>
          <div>
            <h2 id="order-modal-title">전달할 주문을 선택해주세요</h2>
            <p>선택한 정보는 관리자 화면과 고객 상담창에 동시에 반영됩니다.</p>
          </div>
        </header>
        <div className="order-options" role="radiogroup" aria-label="전달할 주문">
          {orders.map((order) => {
            const key = order.orderId ?? "none";
            return (
              <button
                key={key}
                className={selectedKey === key ? "order-option active" : "order-option"}
                role="radio"
                aria-checked={selectedKey === key}
                onClick={() => setDraft(order)}
              >
                <span className="radio-dot" />
                <span>
                  <strong>
                    {order.orderId
                      ? `주문 ${order.orderId} / ${order.productName} / ${order.status}`
                      : "주문 없이 문의하기"}
                  </strong>
                  <small>
                    {order.orderId ? `${order.brand} 상품 문의로 전달` : "대화 내용만 상담원에게 전달"}
                  </small>
                </span>
              </button>
            );
          })}
        </div>
        <footer>
          <button className="ghost-button" onClick={onCancel}>취소</button>
          <button className="primary-button" onClick={() => onApply(draft)}>적용</button>
        </footer>
      </section>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
