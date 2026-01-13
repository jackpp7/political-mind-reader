import streamlit as st
import google.generativeai as genai

# --- 頁面設定 ---
st.set_page_config(page_title="官場現形記：讀心模擬器", page_icon="🍵")

# --- 標題區 ---
st.title("🍵 官場現形記：政治讀心模擬器")
st.markdown("""
這裡沒有藍綠白，只有**人性**與**算計**。
輸入政治人物與事件，AI 將為你揭開他們**「冠冕堂皇的官話」**底下，那不為人知的**「內心獨白」**。
""")

# --- 側邊欄：密碼鎖與設定 ---
#with st.sidebar:
    #st.header("🔐 系統權限")
    #password = st.text_input("請輸入通關密語", type="password")
    
    # 這裡設定你的密碼，預設是 8888，你可以自己改
    #if password != "8888":
    #    st.warning("請輸入正確密碼以解鎖功能")
    #    st.stop()
    #else:
    #    st.success("身分驗證通過：資深政治觀察家")

# --- 讀取 API Key (從 Streamlit Secrets) ---
try:
    api_key = st.secrets["GEMINI_API_KEY"]
    genai.configure(api_key=api_key)
except Exception:
    st.error("⚠️ 尚未設定 API Key！請在 Streamlit 後台設定 Secrets。")
    st.stop()

# --- 主要輸入區 ---
col1, col2 = st.columns(2)
with col1:
    person = st.text_input("主角 (政治人物)", value="蔣萬安", placeholder="例如：柯文哲、馬英九")
with col2:
    event = st.text_input("遭遇事件", value="被批評兩岸立場軟弱", placeholder="例如：選舉大敗、被質詢")

run_btn = st.button("🔍 開始剖析 (Start Analysis)", type="primary")

# --- AI 邏輯區 ---
if run_btn and person and event:
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    # 這是我們的核心 Prompt (腐儒毒舌版)
    prompt = f"""
    角色設定：
    你是一位看透台灣政壇三十年怪現狀、帶有「溫馨腐儒」氣息與「犀利毒舌」特質的資深政治觀察家。
    你深諳人性弱點，擅長解讀政治人物「人設」與「本質」的落差。

    任務目標：
    針對人物「{person}」在事件「{event}」中的反應進行深度模擬。

    請輸出以下三段內容（請用台灣繁體中文，並適度加入語助詞與表情符號）：

    1. **【表面官方說法】(🎤)**：
       模擬他在鏡頭前會說的場面話。語氣要符合其人設（如：蔣萬安的標準SOP、柯文哲的亞斯伯格碎念、馬英九的溫良恭儉讓）。

    2. **【真實內心獨白】(🧠)**：
       揭露他內心深處最真實、陰暗或脆弱的想法（如：權貴的傲慢、庶出的焦慮、牆頭草的算計）。語氣要直白且充滿人性矛盾。

    3. **【腐儒的幽幽點評】(🍵)**：
       以第三人稱視角，用「看透紅塵」的文藝腔調，帶有黑色幽默地總結此事。
    """

    with st.spinner('🕵️‍♂️ 正在翻閱該人物的私密日記...'):
        try:
            response = model.generate_content(prompt)
            st.markdown("---")
            st.markdown(response.text)
        except Exception as e:
            st.error(f"連線錯誤：{e}")
