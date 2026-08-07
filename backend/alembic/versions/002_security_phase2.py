"""security phase 2 - refresh tokens, user xp/level, date columns

Revision ID: 002
Revises: 001
Create Date: 2026-08-07
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "002"
down_revision = "001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "refresh_tokens",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("token_hash", sa.String(64), unique=True, nullable=False, index=True),
        sa.Column("expires_at", sa.DateTime, nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=True),
    )

    op.add_column("users", sa.Column("xp", sa.Integer, nullable=False, server_default="0"))
    op.add_column("users", sa.Column("level", sa.Integer, nullable=False, server_default="1"))

    op.alter_column(
        "goals",
        "start_date",
        existing_type=sa.String(10),
        type_=sa.Date(),
        postgresql_using="start_date::date",
    )
    op.alter_column(
        "goals",
        "end_date",
        existing_type=sa.String(10),
        type_=sa.Date(),
        postgresql_using="end_date::date",
    )
    op.alter_column(
        "activities",
        "date",
        existing_type=sa.String(10),
        type_=sa.Date(),
        postgresql_using="date::date",
    )


def downgrade() -> None:
    op.alter_column(
        "activities",
        "date",
        existing_type=sa.Date(),
        type_=sa.String(10),
        postgresql_using="date::text",
    )
    op.alter_column(
        "goals",
        "end_date",
        existing_type=sa.Date(),
        type_=sa.String(10),
        postgresql_using="end_date::text",
    )
    op.alter_column(
        "goals",
        "start_date",
        existing_type=sa.Date(),
        type_=sa.String(10),
        postgresql_using="start_date::text",
    )
    op.drop_column("users", "level")
    op.drop_column("users", "xp")
    op.drop_table("refresh_tokens")
