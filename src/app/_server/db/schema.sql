drop table if exists tag_product;
drop table if exists variant_pricing_value;
drop table if exists variant_pricing;
drop table if exists variant_value;
drop table if exists variant_type;
drop table if exists product_image;
drop table if exists product;
drop table if exists tag;
drop table if exists category;
drop table if exists shop_member;
drop table if exists zedro_admin;
drop table if exists shop;

create table order_record(
    id text primary key not null,
    order_status text not null,
    customer_id text not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp,
    stripe_payment_intent_id text,
    stripe_checkout_session_id text,
    payment_status text
);

create table order_record_product(
    order_record_id text not null,
    product_pricing_id text not null,
    quantity integer not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp,
    primary key (order_record_id, product_pricing_id),
    foreign key (order_record_id) references order_record(id) on delete cascade,
    foreign key (product_pricing_id) references product_pricing(id) on delete cascade
)

create table shop (
    id text primary key not null,
    shop_name text  not null,
    description text not null,
    social_url_facebook text ,
    social_url_instagram text ,
    social_url_linkedin text ,
    address text,
    stripe_account_id text,
    created_at timestamp default current_timestamp,
    updated_at timestamp,
    created_by text,
    updated_by text
);

create table admin (
    id text primary key not null,
    clerk_user_id text,
    created_at timestamp default current_timestamp
);

create table category (
    id text primary key not null,
    category_name text  not null,
    description text not null,
    parent_category_id text default null,
    created_at timestamp default current_timestamp,
    updated_at timestamp,
    created_by text,
    updated_by text,
    foreign key (parent_category_id) references category(id) on delete cascade
);

create table tag (
    id text primary key not null,
    tag_name text  not null,
    description text not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp,
    status varchar(50) not null default 'not_valid',
    created_by text,
    updated_by text
);

create table product_status (
    id text primary key not null,
    status varchar(50) not null unique
);

insert into product_status (id, status) values ('1', 'DRAFT' );
insert into product_status (id, status) values ('2', 'PUBLISHED' );
insert into product_status (id, status) values ('3', 'ARCHIVED' );
insert into product_status (id, status) values ('4', 'PENDING' );

create table product (
    id text primary key not null,
    product_name text  not null,
    description text not null,
    has_variants boolean default 0,
    product_status_id text default "1",
    category_id text,
    created_at timestamp default current_timestamp,
    updated_at timestamp,
    created_by text,
    updated_by text,
    foreign key (category_id) references category(id) on delete cascade,
    foreign key (product_status_id) references product_status(id)
);

create table product_pricing (
    id text primary key not null,
    product_id text not null,
    is_default boolean default 1,
    is_archived boolean default 0,
    price decimal(10, 2) not null check (price >= 0),
    stock integer not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp,
    created_by text,
    updated_by text,
    foreign key (product_id) references product(id) on delete cascade
);

create table product_pricing_value (
    variant_value_id text not null,
    product_pricing_id text not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp,
    created_by text,
    updated_by text,
    foreign key (product_pricing_id) references product_pricing(id) on delete cascade,
    foreign key (variant_value_id) references variant_value(id) on delete cascade
);

create table shopping_cart(
    id text primary key not null,
    product_id text not null,
    variant_pricing_id text,
    quantity integer not null,
    customer_id text not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp,
    created_by text,
    updated_by text,
    foreign key (product_id) references product(id) on delete cascade,
    foreign key (variant_pricing_id) references variant_pricing(id) on delete cascade
)

create table product_image (
    id text primary key not null,
    url varchar(300) not null,
    product_id text not null,
    display_order integer not null default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp,
    created_by text,
    updated_by text,
    foreign key (product_id) references product(id) on delete cascade
);

create table variant_type (
    id text primary key not null,
    variant_type_name text  not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp,
    created_by text,
    updated_by text
);

create table variant_value (
    id text primary key not null,
    variant_value_name text  not null,
    variant_type_id text not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp,
    created_by text,
    updated_by text,
    foreign key (variant_type_id) references variant_type(id) on delete cascade
);

create table tag_product (
    tag_id text not null,
    product_id text not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp,
    created_by text,
    updated_by text,
    primary key (tag_id, product_id),
    foreign key (tag_id) references tag(id) on delete cascade,
    foreign key (product_id) references product(id) on delete cascade
);