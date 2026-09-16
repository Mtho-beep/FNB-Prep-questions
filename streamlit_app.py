from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(page_title="AI Interview Prep", page_icon="🎯", layout="wide")

# Hide Streamlit's own chrome so the embedded React app fills the page.
st.markdown(
    """
    <style>
      #MainMenu, header, footer {visibility: hidden;}
      .block-container {padding: 0 !important; max-width: 100% !important;}
    </style>
    """,
    unsafe_allow_html=True,
)

html_path = Path(__file__).parent / "streamlit_build" / "index.html"
if not html_path.exists():
    st.error("streamlit_build/index.html is missing. Run `npm run build:streamlit` first.")
    st.stop()

components.html(html_path.read_text(encoding="utf-8"), height=1000, scrolling=True)
