###################################################################################
# - chat_input에서 파일 첨부 받기
#   - accept_file(bool | str): True - 첨부가능, "multiple": 여러 파일 첨부가능
#    >> prompt = st.chat_input(placeholder="User:", accept_file=True)  
#
# - st.chat_input의 반환타입인 ChatInputValue의 attributes:
#   - ChatInputValue.text : 텍스트 입력
#   - ChatInputValue.files : 첨부파일을 List에 담아서 반환.
#     - 첨부파일은 UploadFile 타입
#
# - UploadFile attributes:
#     - name(str):  파일 명
#     - getvalue(): bytes - 첨부파일을 bytes로 반환.
###################################################################################
