# src/report_generator.py

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import datetime
import os


FONT_PATH = "assets/fonts/NotoSansDevanagari-Regular.ttf"
FONT_NAME = "NotoHindi"


def generate_disease_report_pdf(
    file_path: str,
    predicted_class: str,
    confidence: float,
    disease_info_hi: dict
):
    """
    Generates Hindi PDF report (Windows/Linux safe).
    """

    if not os.path.exists(FONT_PATH):
        raise FileNotFoundError(
            f"Hindi font not found at {FONT_PATH}. "
            "Please add NotoSansDevanagari-Regular.ttf"
        )

    # Register font ONCE per process
    if FONT_NAME not in pdfmetrics.getRegisteredFontNames():
        pdfmetrics.registerFont(TTFont(FONT_NAME, FONT_PATH))

    styles = getSampleStyleSheet()
    for s in styles.byName.values():
        s.fontName = FONT_NAME

    doc = SimpleDocTemplate(file_path, pagesize=A4)
    elements = []

    # Title
    elements.append(Paragraph("<b>कपास रोग पहचान रिपोर्ट</b>", styles["Title"]))
    elements.append(Spacer(1, 12))

    # Date
    date_str = datetime.now().strftime("%d-%m-%Y %H:%M")
    elements.append(Paragraph(f"तारीख: {date_str}", styles["Normal"]))
    elements.append(Spacer(1, 12))

    # Prediction summary
    elements.append(Paragraph(
        f"<b>पहचाना गया रोग / कीट:</b> {disease_info_hi.get('नाम', predicted_class)}",
        styles["Normal"]
    ))
    elements.append(Paragraph(
        f"<b>विश्वसनीयता:</b> {confidence * 100:.2f}%",
        styles["Normal"]
    ))
    elements.append(Spacer(1, 12))

    # Description
    elements.append(Paragraph("<b>विवरण:</b>", styles["Heading3"]))
    elements.append(Paragraph(disease_info_hi.get("विवरण", ""), styles["Normal"]))
    elements.append(Spacer(1, 12))

    # Treatment steps
    elements.append(Paragraph("<b>उपचार के कदम:</b>", styles["Heading3"]))
    steps = disease_info_hi.get("उपचार_कदम", [])

    if steps:
        elements.append(
            ListFlowable(
                [ListItem(Paragraph(step, styles["Normal"])) for step in steps],
                bulletType="bullet"
            )
        )
    else:
        elements.append(Paragraph("कोई विशेष उपचार आवश्यक नहीं।", styles["Normal"]))

    elements.append(Spacer(1, 12))

    # Pesticides
    elements.append(Paragraph("<b>अनुशंसित कीटनाशक / दवाएँ:</b>", styles["Heading3"]))
    pesticides = disease_info_hi.get("अनुशंसित_कीटनाशक", [])

    if pesticides:
        elements.append(
            ListFlowable(
                [ListItem(Paragraph(p, styles["Normal"])) for p in pesticides],
                bulletType="bullet"
            )
        )
    else:
        elements.append(Paragraph("कीटनाशक की आवश्यकता नहीं है।", styles["Normal"]))

    elements.append(Spacer(1, 16))

    # Disclaimer
    elements.append(Paragraph(
        "<b>महत्वपूर्ण सूचना:</b> यह जानकारी सामान्य मार्गदर्शन हेतु है। "
        "किसी भी दवा का उपयोग करने से पहले नजदीकी कृषि अधिकारी से सलाह अवश्य लें।",
        styles["Italic"]
    ))

    doc.build(elements)
